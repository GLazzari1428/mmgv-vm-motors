import { createApp } from './app.js'
import { env } from './config/env.js'
import { pool } from './config/db.js'
import { seedDemoUser } from '../scripts/seedDemo.js'

const app = createApp()

async function start() {
  try {
    // confere que o banco responde antes de aceitar requisicoes
    await pool.query('SELECT 1')

    // recria o usuario de demonstracao em estado limpo a cada boot
    try {
      await seedDemoUser()
    } catch (err) {
      console.error('aviso: falha ao popular o usuario demo:', err.message)
    }

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
