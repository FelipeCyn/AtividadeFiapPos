import jwt from 'jsonwebtoken'
import Teacher from '../models/Teacher.js'

const JWT_SECRET = process.env.JWT_SECRET || 'fiap_blog_secret_key'

export const generateToken = (teacher) => {
  return jwt.sign(
    { id: teacher.id, email: teacher.email, nome: teacher.nome },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' })
    }

    const parts = authHeader.split(' ')

    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Token mal formatado' })
    }

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token mal formatado' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)

    const teacher = await Teacher.findById(decoded.id)

    if (!teacher) {
      return res.status(401).json({ error: 'Professor não encontrado' })
    }

    req.teacher = teacher

    return next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' })
    }
    return res.status(401).json({ error: 'Token inválido' })
  }
}
