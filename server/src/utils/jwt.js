import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

// gera um token com o id do usuario no payload
export function signToken(userId) {
  return jwt.sign({ sub: userId }, env.jwt.secret, { expiresIn: env.jwt.expires })
}

// valida o token e devolve o payload, ou lanca erro
export function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret)
}
