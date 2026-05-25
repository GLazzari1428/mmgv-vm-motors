// formata numero pra moeda brasileira
export function formatMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

// label e cor de cada status
export const statusInfo = {
  ok: { label: 'em dia', bar: 'green' },
  warn: { label: 'alerta', bar: 'yellow' },
  late: { label: 'vencido', bar: 'red' },
}

// conta itens por status numa lista
export function contarStatus(itens) {
  return itens.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    },
    { ok: 0, warn: 0, late: 0 }
  )
}

// pior status entre os itens, pra resumir o estado do carro
export function piorStatus(itens) {
  if (itens.some((i) => i.status === 'late')) return 'late'
  if (itens.some((i) => i.status === 'warn')) return 'warn'
  return 'ok'
}
