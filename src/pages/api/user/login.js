import { connectDB } from '@/lib/mongodb'
import User from '@/data/user.js'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  await connectDB()

  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Credenciales inválidas' })
  }
  const token = signToken({ id: user._id, role: user.role })
  res.json({ user, token })
}
