import { v2 as cloudinary } from 'cloudinary'
import { IncomingForm } from 'formidable'

export const config = {
  api: {
    bodyParser: false,
  },
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  })

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err)
      return res.status(500).json({ error: 'Error al procesar la imagen' })
    }

    console.log('Files received:', files)
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file
    
    if (!file) {
      console.error('No file received')
      return res.status(400).json({ error: 'No se recibió archivo' })
    }

    console.log('File details:', {
      originalFilename: file.originalFilename,
      mimetype: file.mimetype,
      size: file.size,
      filepath: file.filepath
    })

    try {
      const uploadResponse = await cloudinary.uploader.upload(file.filepath, {
        folder: 'bodas-woowbe',
        resource_type: 'auto', // Detecta automáticamente el tipo de archivo
      })

      console.log('Upload successful:', uploadResponse.secure_url)
      
      return res.status(200).json({ url: uploadResponse.secure_url })
    } catch (error) {
      console.error('Cloudinary error:', error)
      return res.status(500).json({ error: 'Error al subir a Cloudinary: ' + error.message })
    }
  })
}