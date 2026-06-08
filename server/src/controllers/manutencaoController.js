import { query } from '../config/db.js'
import { toBR, toISO } from '../utils/format.js'
import { badRequest, notFound } from '../utils/httpError.js'
import { buscarCarroDoUsuario, itensDoCarro } from './carrosController.js'

// registra no log de historico cada troca feita (so quando tem data de ultima troca)
async function registrarHistorico(itemId, ultimaTroca, proximaTroca, km) {
  const u = toISO(ultimaTroca)
  if (!u) return
  await query(
    'INSERT INTO historico_manutencao (item_id, ultima_troca, proxima_troca, km) VALUES (?, ?, ?, ?)',
    [itemId, u, toISO(proximaTroca), km ?? null]
  )
}

// GET /api/carros/:id/itens
export async function listarItens(req, res) {
  await buscarCarroDoUsuario(req.params.id, req.userId)
  res.json(await itensDoCarro(req.params.id))
}

// POST /api/carros/:id/itens  (registra um item de manutencao novo no carro)
export async function criarItem(req, res) {
  const carro = await buscarCarroDoUsuario(req.params.id, req.userId)
  const { tipo, ultimaTroca, proximaTroca, km } = req.body

  const tipos = await query('SELECT id FROM tipos_item WHERE codigo = ?', [tipo])
  if (!tipos.length) throw badRequest('tipo de item invalido')

  const jaTem = await query(
    'SELECT id FROM itens_manutencao WHERE carro_id = ? AND tipo_item_id = ?',
    [carro.id, tipos[0].id]
  )

  let itemId
  if (jaTem.length) {
    // ja acompanha esse item, entao apenas atualiza as datas e km
    itemId = jaTem[0].id
    await query(
      'UPDATE itens_manutencao SET ultima_troca = ?, proxima_troca = ?, km = ? WHERE id = ?',
      [toISO(ultimaTroca), toISO(proximaTroca), km ?? null, itemId]
    )
  } else {
    const result = await query(
      `INSERT INTO itens_manutencao (carro_id, tipo_item_id, ultima_troca, proxima_troca, km)
       VALUES (?, ?, ?, ?, ?)`,
      [carro.id, tipos[0].id, toISO(ultimaTroca), toISO(proximaTroca), km ?? null]
    )
    itemId = result.insertId
  }

  await registrarHistorico(itemId, ultimaTroca, proximaTroca, km)
  res.status(201).json(await itensDoCarro(carro.id))
}

// PUT /api/itens/:itemId  (registra a troca de um item)
export async function atualizarItem(req, res) {
  const { itemId } = req.params
  const { ultimaTroca, proximaTroca, km } = req.body

  // confere que o item pertence a um carro do usuario
  const rows = await query(
    `SELECT im.id, im.carro_id
       FROM itens_manutencao im
       JOIN carros c ON c.id = im.carro_id
      WHERE im.id = ? AND c.usuario_id = ?`,
    [itemId, req.userId]
  )
  if (!rows.length) throw notFound('item nao encontrado')

  await query(
    'UPDATE itens_manutencao SET ultima_troca = ?, proxima_troca = ?, km = ? WHERE id = ?',
    [toISO(ultimaTroca), toISO(proximaTroca), km ?? null, itemId]
  )
  await registrarHistorico(itemId, ultimaTroca, proximaTroca, km)
  res.json(await itensDoCarro(rows[0].carro_id))
}

// GET /api/itens/:itemId/historico  (trocas ao longo do tempo, com intervalo em dias)
export async function listarHistorico(req, res) {
  const { itemId } = req.params
  const rows = await query(
    `SELECT h.ultima_troca
       FROM historico_manutencao h
       JOIN itens_manutencao im ON im.id = h.item_id
       JOIN carros c ON c.id = im.carro_id
      WHERE h.item_id = ? AND c.usuario_id = ? AND h.ultima_troca IS NOT NULL
      ORDER BY h.ultima_troca ASC`,
    [itemId, req.userId]
  )

  const historico = rows.map((r, i) => {
    let intervaloDias = 0
    if (i > 0) {
      const anterior = new Date(rows[i - 1].ultima_troca)
      const atual = new Date(r.ultima_troca)
      intervaloDias = Math.round((atual - anterior) / 86400000)
    }
    return { data: toBR(r.ultima_troca), intervaloDias }
  })
  res.json(historico)
}

// GET /api/tipos-item
export async function listarTipos(_req, res) {
  const rows = await query('SELECT codigo, nome, icone FROM tipos_item ORDER BY id')
  res.json(rows.map((r) => ({ id: r.codigo, nome: r.nome, icone: r.icone })))
}
