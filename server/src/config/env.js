import 'dotenv/config'

// leitura centralizada das variaveis de ambiente do backend
export const env = {
  port: Number(process.env.PORT) || 8000,

  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'vmmotors',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'troque-este-segredo',
    expires: process.env.JWT_EXPIRES || '7d',
  },

  // lista de origens liberadas no CORS
  corsOrigin: (process.env.CORS_ORIGIN || 'http://127.0.0.1:3000')
    .split(',')
    .map((o) => o.trim()),
}
