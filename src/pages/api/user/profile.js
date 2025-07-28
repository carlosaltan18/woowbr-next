import { withAuth } from '@/lib/auth'

const handler = (req, res) => {
  res.json({ message: `Bienvenido ${req.user.role}`, user: req.user })
}

export default withAuth(handler, ['admin']) // Solo admin o user
