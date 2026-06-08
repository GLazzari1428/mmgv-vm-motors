import { createApp } from './app.js'
import { env } from './config/env.js'
import { pool } from './config/db.js'

const app = createApp()

async function start() {
  try {
    // confere que o banco responde antes de aceitar requisicoes
    await pool.query('SELECT 1')
    // bind em 0.0.0.0 pra aceitar acesso pela rede local (ex: celular)
    app.listen(env.port, '0.0.0.0', () => {
      console.log(`API do VM Motors rodando na porta ${env.port} (0.0.0.0)`)
    })
  } catch (err) {
    console.error('falha ao conectar no banco:', err.message)
    process.exit(1)
  }
}

start()
