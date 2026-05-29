import { verifyToken } from '../utils/jwt.js'
import { unauthorized } from '../utils/httpError.js'

// le o token do header Authorization: Bearer <token> e injeta req.userId
export function auth(req, _res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return next(unauthorized('token ausente'))
  }

  try {
    const payload = verifyToken(token)
    req.userId = Number(payload.sub)
    next()
  } catch {
    next(unauthorized('token invalido ou expirado'))
  }
}
