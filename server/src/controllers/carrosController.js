import { query } from '../config/db.js'
import { toBR, toISO } from '../utils/format.js'
import { notFound, conflict } from '../utils/httpError.js'

// itens base que todo carro novo comeca acompanhando (espelha o front)
const ITENS_BASE = ['oleo', 'pneu', 'filtro']

// busca os itens de um carro ja no formato que o front consome (com status da view)
async function itensDoCarro(carroId) {
  const rows = await query(
    `SELECT id, tipo_codigo, tipo_nome, tipo_icone, ultima_troca, proxima_troca, km, status
       FROM vw_itens_status
      WHERE carro_id = ?
      ORDER BY id`,
    [carroId]
  )
  return rows.map((r) => ({
    id: r.id,
    codigo: r.tipo_codigo,
    nome: r.tipo_nome,
    icone: r.tipo_icone,
    status: r.status,
    ultimaTroca: toBR(r.ultima_troca),
    proximaTroca: toBR(r.proxima_troca),
    km: r.km ?? null,
  }))
}

// monta o objeto de carro no formato do front
async function montarCarro(row) {
  return {
    id: row.id,
    modelo: row.modelo,
    placa: row.placa,
    ano: row.ano,
    cor: row.cor || '-',
    foto: row.foto ?? null,
    proximaRevisao: toBR(row.proxima_revisao),
    itens: await itensDoCarro(row.id),
  }
}

// garante que o carro existe e pertence ao usuario logado
async function buscarCarroDoUsuario(carroId, userId) {
  const rows = await query(
    'SELECT * FROM carros WHERE id = ? AND usuario_id = ?',
    [carroId, userId]
  )
  if (!rows.length) throw notFound('carro nao encontrado')
  return rows[0]
}

// GET /api/carros
export async function listar(req, res) {
  const rows = await query(
    'SELECT * FROM carros WHERE usuario_id = ? ORDER BY id',
    [req.userId]
  )
  const carros = await Promise.all(rows.map(montarCarro))
  res.json(carros)
}

// GET /api/carros/:id
export async function obter(req, res) {
  const carro = await buscarCarroDoUsuario(req.params.id, req.userId)
  res.json(await montarCarro(carro))
}

// POST /api/carros
export async function criar(req, res) {
  const { modelo, placa, ano, cor, proximaRevisao, foto } = req.body

  const placaEmUso = await query(
    'SELECT id FROM carros WHERE usuario_id = ? AND placa = ?',
    [req.userId, placa]
  )
  if (placaEmUso.length) throw conflict('voce ja tem um carro com essa placa')

  const result = await query(
    `INSERT INTO carros (usuario_id, modelo, placa, ano, cor, proxima_revisao, foto)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      req.userId,
      modelo,
      placa,
      ano ?? null,
      cor ?? null,
      toISO(proximaRevisao),
      foto ?? null,
    ]
  )
  const carroId = result.insertId

  // semeia os itens base usando os tipos cadastrados
  const tipos = await query(
    `SELECT id FROM tipos_item WHERE codigo IN (?, ?, ?)`,
    ITENS_BASE
  )
  for (const t of tipos) {
    await query(
      'INSERT INTO itens_manutencao (carro_id, tipo_item_id) VALUES (?, ?)',
      [carroId, t.id]
    )
  }

  const carro = await buscarCarroDoUsuario(carroId, req.userId)
  res.status(201).json(await montarCarro(carro))
}

// PUT /api/carros/:id
export async function atualizar(req, res) {
  const carro = await buscarCarroDoUsuario(req.params.id, req.userId)
  const { modelo, placa, ano, cor, proximaRevisao, foto } = req.body

  // foto e opcional no update: se nao veio, mantem a atual
  if (foto === undefined) {
    await query(
      `UPDATE carros SET modelo = ?, placa = ?, ano = ?, cor = ?, proxima_revisao = ?
       WHERE id = ?`,
      [modelo, placa, ano ?? null, cor ?? null, toISO(proximaRevisao), carro.id]
    )
  } else {
    await query(
      `UPDATE carros SET modelo = ?, placa = ?, ano = ?, cor = ?, proxima_revisao = ?, foto = ?
       WHERE id = ?`,
      [
        modelo,
        placa,
        ano ?? null,
        cor ?? null,
        toISO(proximaRevisao),
        foto,
        carro.id,
      ]
    )
  }
  const atualizado = await buscarCarroDoUsuario(carro.id, req.userId)
  res.json(await montarCarro(atualizado))
}

// DELETE /api/carros/:id
export async function remover(req, res) {
  const carro = await buscarCarroDoUsuario(req.params.id, req.userId)
  await query('DELETE FROM carros WHERE id = ?', [carro.id])
  res.json({ ok: true })
}

export { buscarCarroDoUsuario, itensDoCarro }
