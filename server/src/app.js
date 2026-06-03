import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import authRoutes from './routes/authRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import carrosRoutes from './routes/carrosRoutes.js'
import lookupRoutes from './routes/lookupRoutes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(cors({ origin: env.corsOrigin }))
  app.use(express.json())

  // checagem de saude
  app.get('/api/health', (_req, res) => res.json({ ok: true }))

  // rotas da aplicacao
  app.use('/api/auth', authRoutes)
  app.use('/api/usuario', usuarioRoutes)
  app.use('/api/carros', carrosRoutes)
  app.use('/api', lookupRoutes)

  // 404 e tratamento de erro no fim da cadeia
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
