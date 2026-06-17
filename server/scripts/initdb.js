// cria o banco (se preciso) e aplica schema + seeds da pasta /db
// uso: node scripts/initdb.js
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import mysql from 'mysql2/promise'
import { env } from '../src/config/env.js'

const here = dirname(fileURLToPath(import.meta.url))
const dbDir = join(here, '..', '..', 'db')

const arquivos = [
  'schema_base.sql',
  'schema_financeiro.sql',
  'schema_premium.sql',
  'seed_base.sql',
  'seed_financeiro.sql',
]

async function main() {
  // conecta sem selecionar database, pra poder cria-lo
  const conn = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    multipleStatements: true,
  })

  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${env.db.database}\`
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  )
  await conn.changeUser({ database: env.db.database })

  for (const nome of arquivos) {
    const sql = await readFile(join(dbDir, nome), 'utf8')
    await conn.query(sql)
    console.log(`aplicado: ${nome}`)
  }

  await conn.end()
  console.log('banco pronto.')
}

main().catch((err) => {
  console.error('falha ao inicializar o banco:', err.message)
  process.exit(1)
})
