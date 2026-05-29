import mysql from 'mysql2/promise'
import { env } from './env.js'

// pool de conexoes reaproveitado em toda a aplicacao
export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
  charset: 'utf8mb4',
})

// helper que executa uma query e devolve so as linhas
export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params)
  return rows
}
