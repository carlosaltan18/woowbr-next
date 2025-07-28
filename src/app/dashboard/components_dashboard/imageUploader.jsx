"use client"

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, CheckCircle, AlertCircle, Copy, ExternalLink, FileImage } from "lucide-react"
import { cn } from "@/lib/utils"

export function ImageUploader({
  maxFiles = 5,
  maxSize = 10, // en MB
  acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  onUploadComplete,
  className,
}) {
  const [images, setImages] = useState([])
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  // Validar archivo
  const validateFile = (file) => { 
    if (!acceptedTypes.includes(file.type)) {
      return `Tipo de archivo no válido. Solo se permiten: ${acceptedTypes.join(", ")}`
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `El archivo es demasiado grande. Máximo ${maxSize}MB`
    }
    return null
  }

  // Agregar archivos
  const addFiles = useCallback(
    (files) => {
      const fileArray = Array.from(files)
      const newImages = []

      for (const file of fileArray) {
        if (images.length + newImages.length >= maxFiles) {
          setError(`Máximo ${maxFiles} archivos permitidos`)
          break
        }

        const validationError = validateFile(file)
        if (validationError) {
          setError(validationError)
          continue
        }

        const imageFile = {
          file,
          preview: URL.createObjectURL(file),
          id: Math.random().toString(36).substr(2, 9),
        }
        newImages.push(imageFile)
      }

      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages])
        setError(null)
      }
    },
    [images.length, maxFiles, maxSize, acceptedTypes],
  )

  // Manejar selección de archivos
  const handleFileSelect = (e) => {
    if (e.target.files) {
      addFiles(e.target.files)
    }
  }

  // Manejar drag & drop
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files) {
        addFiles(e.dataTransfer.files)
      }
    },
    [addFiles],
  )

  // Remover imagen
  const removeImage = (id) => {
    setImages((prev) => {
      const updated = prev.filter((img) => img.id !== id)
      // Limpiar URL del preview
      const imageToRemove = prev.find((img) => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return updated
    })
  }

  // Subir imágenes
  const handleUpload = async () => {
    if (images.length === 0) {
      setError("Por favor selecciona al menos una imagen")
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const uploadPromises = images.map(async (imageFile, index) => {
        const formData = new FormData()
        formData.append("file", imageFile.file)

        const response = await fetch("/api/imagesUploader/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Error al subir la imagen")
        }

        const data = await response.json()

        // Actualizar progreso
        const progress = ((index + 1) / images.length) * 100
        setUploadProgress(progress)

        return {
          url: data.url,
          publicId: data.public_id,
          originalName: imageFile.file.name,
        }
      })

      const results = await Promise.all(uploadPromises)
      setUploadedImages((prev) => [...prev, ...results])

      // Limpiar imágenes seleccionadas
      images.forEach((img) => URL.revokeObjectURL(img.preview))
      setImages([])

      // Callback con URLs
      if (onUploadComplete) {
        onUploadComplete(results.map((r) => r.url))
      }
    } catch (error) {
      console.error("Error al subir:", error)
      setError(error instanceof Error ? error.message : "Error desconocido al subir las imágenes")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // Copiar URL al portapapeles
  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      // Aquí podrías agregar un toast notification
    } catch (err) {
      console.error("Error al copiar:", err)
    }
  }

  // Formatear tamaño de archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Zona de Drop */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          uploading && "pointer-events-none opacity-50",
        )}
      >
        <CardContent className="p-8">
          <div
            className="text-center space-y-4"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Subir Imágenes</h3>
              <p className="text-muted-foreground">
                Arrastra y suelta tus imágenes aquí, o{" "}
                <label className="text-primary hover:text-primary/80 cursor-pointer underline">
                  selecciona archivos
                  <input
                    type="file"
                    multiple
                    accept={acceptedTypes.join(",")}
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">Máximo {maxFiles} archivos</Badge>
                <Badge variant="secondary">Hasta {maxSize}MB cada uno</Badge>
                <Badge variant="secondary">JPG, PNG, WebP, GIF</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Preview de imágenes seleccionadas */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <FileImage className="w-4 h-4" />
            Imágenes Seleccionadas ({images.length})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <img src={image.preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removeImage(image.id)}
                    disabled={uploading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate">{image.file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(image.file.size)}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Botón de subida y progreso */}
          <div className="space-y-3">
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subiendo imágenes...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <Button onClick={handleUpload} disabled={images.length === 0 || uploading} className="w-full" size="lg">
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Subiendo... ({Math.round(uploadProgress)}%)
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Subir {images.length} imagen{images.length !== 1 ? "es" : ""}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Imágenes subidas */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Imágenes Subidas ({uploadedImages.length})
          </h4>

          <div className="space-y-3">
            {uploadedImages.map((image, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.originalName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <p className="font-medium truncate">{image.originalName}</p>
                        <p className="text-sm text-muted-foreground truncate">{image.url}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(image.url)}>
                          <Copy className="w-3 h-3 mr-1" />
                          Copiar URL
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={image.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Ver
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}