// recria o usuario de demonstracao com dados completos.
// rodado toda vez que o backend sobe pra garantir que a apresentacao
// volta sempre pro mesmo estado, mesmo se alguem mexer no app durante o demo.

import bcrypt from 'bcryptjs'
import { query } from '../src/config/db.js'

const DEMO_EMAIL = 'demo@vmmotors.app'
const DEMO_SENHA = 'demo123'
const DEMO_NOME = 'Demonstração'

// SVG inline -> base64. mantemos pequeno e simples pra nao inchar o payload.
function svgPng(cor, sigla) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  <rect width="240" height="240" fill="${cor}"/>
  <text x="120" y="148" font-family="Inter, sans-serif" font-size="84" font-weight="700" fill="white" text-anchor="middle" letter-spacing="-2">${sigla}</text>
</svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

const AVATAR_DEMO = svgPng('#14213d', 'D')

// dataset dos 3 carros: cada um com perfil de uso diferente
const CARROS = [
  {
    modelo: 'Honda Civic',
    placa: 'DEM-1A18',
    ano: 2018,
    cor: 'Prata',
    foto: svgPng('#6b7280', 'HC'),
    proxima_revisao_dias: 65,
    consumo: { combustivel: 145, manutencao: 220, seguro: 130, ipva: 880, multas: 95 },
  },
  {
    modelo: 'Chevrolet Onix',
    placa: 'DEM-2B21',
    ano: 2021,
    cor: 'Branco',
    foto: svgPng('#e5e7eb', 'CO'),
    proxima_revisao_dias: 30,
    consumo: { combustivel: 165, manutencao: 180, seguro: 150, ipva: 1100, multas: 0 },
  },
  {
    modelo: 'Jeep Compass',
    placa: 'DEM-3C23',
    ano: 2023,
    cor: 'Preto',
    foto: svgPng('#1f2937', 'JC'),
    proxima_revisao_dias: 110,
    consumo: { combustivel: 240, manutencao: 320, seguro: 220, ipva: 2400, multas: 130 },
  },
]

// itens de manutencao por carro: cada array tem 5 entradas
// (oleo, pneu, filtro, correia, alinhamento)
// statusTarget: 'late' (passado), 'warn' (~20 dias), 'ok' (folga)
function montarItens(kmBase) {
  return [
    { codigo: 'oleo',        statusTarget: 'warn', kmDelta: 0 },
    { codigo: 'pneu',        statusTarget: 'ok',   kmDelta: -2000 },
    { codigo: 'filtro',      statusTarget: 'late', kmDelta: -500 },
    { codigo: 'correia',     statusTarget: 'ok',   kmDelta: -8000 },
    { codigo: 'alinhamento', statusTarget: 'ok',   kmDelta: -1200 },
  ].map((i) => ({ ...i, km: kmBase + i.kmDelta }))
}

const KM_BASE = [78400, 42100, 25300]

// dias atras da ultima troca por status (proxima = ultima + intervalo)
const INTERVALOS = {
  late: { ultimaDias: 200, proximaDias: -15 },
  warn: { ultimaDias: 160, proximaDias: 20 },
  ok:   { ultimaDias: 30,  proximaDias: 240 },
}

const POSTOS = ['Posto Shell', 'Posto Ipiranga', 'Posto BR', 'Posto Petrobras']
const SERVICOS = [
  'Troca de oleo',
  'Pastilha de freio',
  'Alinhamento e balanceamento',
  'Troca de filtro de ar',
  'Revisao geral',
]
const MULTAS = ['Excesso de velocidade', 'Estacionamento irregular']

function isoDataDiasAtras(dias) {
  const d = new Date()
  d.setDate(d.getDate() - dias)
  return d.toISOString().slice(0, 10)
}

function dataDiasFrente(dias) {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return d.toISOString().slice(0, 10)
}

// gera transacoes pra um carro espalhadas em ~7 meses
function montarTransacoes(consumo) {
  const transacoes = []
  // combustivel: 4 por mes, valor proximo do referencial
  for (let mes = 0; mes < 7; mes++) {
    for (let semana = 0; semana < 4; semana++) {
      const dia = mes * 30 + semana * 7 + 2
      const valor = consumo.combustivel * (0.9 + Math.random() * 0.25)
      transacoes.push({
        categoria: 'combustivel',
        descricao: POSTOS[(mes + semana) % POSTOS.length],
        data: isoDataDiasAtras(dia),
        valor: Number(valor.toFixed(2)),
      })
    }
  }
  // seguro: parcela mensal
  for (let mes = 0; mes < 7; mes++) {
    transacoes.push({
      categoria: 'seguro',
      descricao: 'Parcela do seguro',
      data: isoDataDiasAtras(mes * 30 + 1),
      valor: consumo.seguro,
    })
  }
  // manutencao: 1 evento a cada 2 meses
  for (let i = 0; i < 4; i++) {
    transacoes.push({
      categoria: 'manutencao',
      descricao: SERVICOS[i % SERVICOS.length],
      data: isoDataDiasAtras(i * 60 + 18),
      valor: consumo.manutencao + Math.round(Math.random() * 80),
    })
  }
  // ipva: pagamento unico no inicio do ano-fiscal (180 dias atras)
  transacoes.push({
    categoria: 'ipva',
    descricao: 'IPVA do ano',
    data: isoDataDiasAtras(180),
    valor: consumo.ipva,
  })
  // multas (opcional)
  if (consumo.multas > 0) {
    transacoes.push({
      categoria: 'multas',
      descricao: MULTAS[0],
      data: isoDataDiasAtras(90),
      valor: consumo.multas,
    })
  }
  return transacoes
}

async function tiposItem() {
  const rows = await query('SELECT id, codigo FROM tipos_item')
  return Object.fromEntries(rows.map((r) => [r.codigo, r.id]))
}

async function categoriasFinanceiras() {
  const rows = await query('SELECT id, codigo FROM categorias_financeiras')
  return Object.fromEntries(rows.map((r) => [r.codigo, r.id]))
}

export async function seedDemoUser() {
  // se ja existe, derruba (cascade limpa tudo que pertence ao usuario)
  await query('DELETE FROM usuarios WHERE email = ?', [DEMO_EMAIL])

  const hash = await bcrypt.hash(DEMO_SENHA, 10)
  const inicioPlano = new Date()
  inicioPlano.setDate(inicioPlano.getDate() - 120)

  const resUser = await query(
    `INSERT INTO usuarios
       (nome, email, senha_hash, plano, plano_ciclo, plano_inicio, plano_fim, foto)
     VALUES (?, ?, ?, 'premium', 'anual', ?, DATE_ADD(?, INTERVAL 365 DAY), ?)`,
    [
      DEMO_NOME,
      DEMO_EMAIL,
      hash,
      inicioPlano.toISOString().slice(0, 19).replace('T', ' '),
      inicioPlano.toISOString().slice(0, 19).replace('T', ' '),
      AVATAR_DEMO,
    ]
  )
  const userId = resUser.insertId

  const tipos = await tiposItem()
  const cats = await categoriasFinanceiras()

  for (let idx = 0; idx < CARROS.length; idx++) {
    const c = CARROS[idx]
    const resCarro = await query(
      `INSERT INTO carros
         (usuario_id, modelo, placa, ano, cor, foto, proxima_revisao)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        c.modelo,
        c.placa,
        c.ano,
        c.cor,
        c.foto,
        dataDiasFrente(c.proxima_revisao_dias),
      ]
    )
    const carroId = resCarro.insertId

    // itens de manutencao
    const itens = montarItens(KM_BASE[idx])
    for (const item of itens) {
      const tipoId = tipos[item.codigo]
      if (!tipoId) continue
      const intervalo = INTERVALOS[item.statusTarget]
      const ultima = isoDataDiasAtras(intervalo.ultimaDias)
      const proxima = intervalo.proximaDias >= 0
        ? dataDiasFrente(intervalo.proximaDias)
        : isoDataDiasAtras(-intervalo.proximaDias)

      const resItem = await query(
        `INSERT INTO itens_manutencao
           (carro_id, tipo_item_id, ultima_troca, proxima_troca, km)
         VALUES (?, ?, ?, ?, ?)`,
        [carroId, tipoId, ultima, proxima, item.km]
      )
      const itemId = resItem.insertId

      // historico retroativo: 4 trocas espacadas em ~7 meses
      let kmHist = item.km
      for (let h = 4; h >= 1; h--) {
        const diasAtras = intervalo.ultimaDias + h * 180
        const registrado = isoDataDiasAtras(diasAtras)
        const proximaHist = isoDataDiasAtras(diasAtras - 180)
        kmHist -= 4500
        await query(
          `INSERT INTO historico_manutencao
             (item_id, ultima_troca, proxima_troca, km, registrado_em)
           VALUES (?, ?, ?, ?, ?)`,
          [itemId, registrado, proximaHist, Math.max(kmHist, 0), `${registrado} 09:00:00`]
        )
      }
    }

    // transacoes financeiras
    for (const t of montarTransacoes(c.consumo)) {
      const catId = cats[t.categoria]
      if (!catId) continue
      await query(
        `INSERT INTO transacoes (carro_id, categoria_id, descricao, data, valor)
         VALUES (?, ?, ?, ?, ?)`,
        [carroId, catId, t.descricao, t.data, t.valor]
      )
    }
  }

  console.log(`demo user seedado: ${DEMO_EMAIL} / ${DEMO_SENHA} (id=${userId})`)
}
