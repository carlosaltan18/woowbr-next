import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET;



export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch (err) {
    return null
  }
}


export function withAuth(handler, allowedRoles = []) {
  return async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    const payload = verifyToken(token)

    if (!payload || (allowedRoles.length && !allowedRoles.includes(payload.role))) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    req.user = payload
    return handler(req, res)
  }
}
