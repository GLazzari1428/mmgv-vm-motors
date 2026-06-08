import { query } from '../config/db.js'
import { toBR, toISO } from '../utils/format.js'
import { badRequest, notFound } from '../utils/httpError.js'
import { buscarCarroDoUsuario } from './carrosController.js'

const num = (v) => Number(v) || 0

// mes de referencia: usa o parametro ?mes=YYYY-MM, senao o mes atual
function mesReferencia(mes) {
  if (mes && /^\d{4}-\d{2}$/.test(mes)) return `${mes}-01`
  return new Date().toISOString().slice(0, 8) + '01'
}

// GET /api/carros/:id/financeiro?mes=YYYY-MM
export async function resumo(req, res) {
  const carro = await buscarCarroDoUsuario(req.params.id, req.userId)
  const ref = mesReferencia(req.query.mes)

  // total do mes de referencia e do mes anterior
  const totais = await query(
    `SELECT
       COALESCE(SUM(CASE WHEN data >= ? AND data < ? + INTERVAL 1 MONTH THEN valor END), 0) AS totalMes,
       COALESCE(SUM(CASE WHEN data >= ? - INTERVAL 1 MONTH AND data < ? THEN valor END), 0) AS mesAnterior
     FROM transacoes WHERE carro_id = ?`,
    [ref, ref, ref, ref, carro.id]
  )

  // gasto por categoria no mes de referencia (todas as categorias, mesmo zeradas)
  const categorias = await query(
    `SELECT cf.codigo, cf.nome, cf.icone,
            COALESCE(SUM(CASE WHEN t.data >= ? AND t.data < ? + INTERVAL 1 MONTH THEN t.valor END), 0) AS valor
       FROM categorias_financeiras cf
       LEFT JOIN transacoes t ON t.categoria_id = cf.id AND t.carro_id = ?
      GROUP BY cf.id, cf.codigo, cf.nome, cf.icone
      ORDER BY cf.id`,
    [ref, ref, carro.id]
  )

  // transacoes do mes de referencia
  const transacoes = await query(
    `SELECT t.id, cf.codigo AS categoria, cf.icone, t.descricao, t.data, t.valor
       FROM transacoes t
       JOIN categorias_financeiras cf ON cf.id = t.categoria_id
      WHERE t.carro_id = ? AND t.data >= ? AND t.data < ? + INTERVAL 1 MONTH
      ORDER BY t.data DESC, t.id DESC`,
    [carro.id, ref, ref]
  )

  res.json({
    mes: ref.slice(0, 7),
    totalMes: num(totais[0].totalMes),
    mesAnterior: num(totais[0].mesAnterior),
    categorias: categorias.map((c) => ({
      id: c.codigo,
      nome: c.nome,
      icone: c.icone,
      valor: num(c.valor),
    })),
    transacoes: transacoes.map((t) => ({
      id: t.id,
      categoria: t.categoria,
      icone: t.icone,
      descricao: t.descricao,
      data: toBR(t.data),
      valor: num(t.valor),
    })),
  })
}

// GET /api/carros/:id/financeiro/historico?categoria=<codigo>
// total gasto nos ultimos 6 meses (geral ou de uma categoria)
export async function historico(req, res) {
  const carro = await buscarCarroDoUsuario(req.params.id, req.userId)

  let catId = null
  if (req.query.categoria) {
    const cats = await query(
      'SELECT id FROM categorias_financeiras WHERE codigo = ?',
      [req.query.categoria]
    )
    if (cats.length) catId = cats[0].id
  }

  const rows = await query(
    `SELECT DATE_FORMAT(data, '%Y-%m') AS mes, SUM(valor) AS total
       FROM transacoes
      WHERE carro_id = ? ${catId ? 'AND categoria_id = ?' : ''}
      GROUP BY DATE_FORMAT(data, '%Y-%m')`,
    catId ? [carro.id, catId] : [carro.id]
  )

  const mapa = {}
  rows.forEach((r) => {
    mapa[r.mes] = num(r.total)
  })

  // monta os ultimos 6 meses, incluindo os zerados
  const meses = []
  const hoje = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    meses.push({ mes: key, total: mapa[key] || 0 })
  }
  res.json(meses)
}

// POST /api/carros/:id/transacoes
export async function criarTransacao(req, res) {
  const carro = await buscarCarroDoUsuario(req.params.id, req.userId)
  const { categoria, descricao, data, valor } = req.body

  const cats = await query('SELECT id FROM categorias_financeiras WHERE codigo = ?', [
    categoria,
  ])
  if (!cats.length) throw badRequest('categoria invalida')

  const dataISO = toISO(data)
  await query(
    `INSERT INTO transacoes (carro_id, categoria_id, descricao, data, valor)
     VALUES (?, ?, ?, ?, ?)`,
    [carro.id, cats[0].id, descricao, dataISO, valor]
  )

  // devolve o resumo do mes em que a transacao caiu
  req.params.id = String(carro.id)
  req.query.mes = dataISO ? dataISO.slice(0, 7) : undefined
  return resumo(req, res)
}

// DELETE /api/transacoes/:id
export async function removerTransacao(req, res) {
  const { id } = req.params

  // confere que a transacao pertence a um carro do usuario logado
  const rows = await query(
    `SELECT t.id, t.carro_id, DATE_FORMAT(t.data, '%Y-%m') AS mes
       FROM transacoes t
       JOIN carros c ON c.id = t.carro_id
      WHERE t.id = ? AND c.usuario_id = ?`,
    [id, req.userId]
  )
  if (!rows.length) throw notFound('transacao nao encontrada')

  await query('DELETE FROM transacoes WHERE id = ?', [id])

  // devolve o resumo do mes em que a transacao estava
  req.params.id = String(rows[0].carro_id)
  req.query.mes = rows[0].mes
  return resumo(req, res)
}

// GET /api/categorias
export async function listarCategorias(_req, res) {
  const rows = await query(
    'SELECT codigo, nome, icone FROM categorias_financeiras ORDER BY id'
  )
  res.json(rows.map((r) => ({ id: r.codigo, nome: r.nome, icone: r.icone })))
}
