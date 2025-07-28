import { connectDB } from '@/lib/mongodb'
import User from '@/data/user'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  await connectDB()
  const { username, password, role } = req.body

  if (!username || !password) return res.status(400).json({ error: 'Campos requeridos' })
  
  const exists = await User.findOne({ username })
  if (exists) return res.status(400).json({ error: 'Ya existe el usuario' })

  const hashed = bcrypt.hashSync(password, 10)
  const newUser = await User.create({ username, password: hashed, role })

  res.status(201).json({ message: 'Usuario creado', user: newUser.username })
}
