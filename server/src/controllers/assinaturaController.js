import { query } from '../config/db.js'
import { notFound } from '../utils/httpError.js'

// stub de assinatura: nao tem gateway de pagamento de verdade,
// so marcamos o usuario como premium e definimos a janela do plano.
const DIAS_POR_CICLO = { mensal: 30, anual: 365 }

function planoDoRow(row) {
  return {
    plano: row.plano,
    plano_ciclo: row.plano_ciclo,
    plano_inicio: row.plano_inicio,
    plano_fim: row.plano_fim,
  }
}

// GET /api/assinatura
export async function obter(req, res) {
  const rows = await query(
    'SELECT plano, plano_ciclo, plano_inicio, plano_fim FROM usuarios WHERE id = ?',
    [req.userId]
  )
  if (!rows.length) throw notFound('usuario nao encontrado')
  res.json(planoDoRow(rows[0]))
}

// POST /api/assinatura
export async function assinar(req, res) {
  const { ciclo } = req.body
  const dias = DIAS_POR_CICLO[ciclo]

  await query(
    `UPDATE usuarios
        SET plano = 'premium',
            plano_ciclo = ?,
            plano_inicio = NOW(),
            plano_fim = DATE_ADD(NOW(), INTERVAL ? DAY)
      WHERE id = ?`,
    [ciclo, dias, req.userId]
  )

  const rows = await query(
    'SELECT plano, plano_ciclo, plano_inicio, plano_fim FROM usuarios WHERE id = ?',
    [req.userId]
  )
  res.json(planoDoRow(rows[0]))
}

// DELETE /api/assinatura
export async function cancelar(req, res) {
  await query(
    `UPDATE usuarios
        SET plano = 'free',
            plano_ciclo = NULL,
            plano_inicio = NULL,
            plano_fim = NULL
      WHERE id = ?`,
    [req.userId]
  )
  res.json({ plano: 'free', plano_ciclo: null, plano_inicio: null, plano_fim: null })
}
