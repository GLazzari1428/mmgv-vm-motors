// converte data do banco ('YYYY-MM-DD') para o formato que o front usa ('DD/MM/YYYY')
export function toBR(isoDate) {
  if (!isoDate) return '-'
  const [y, m, d] = String(isoDate).slice(0, 10).split('-')
  if (!y || !m || !d) return '-'
  return `${d}/${m}/${y}`
}

// converte 'DD/MM/YYYY' (ou ja 'YYYY-MM-DD') de volta para o formato do banco
export function toISO(brDate) {
  if (!brDate || brDate === '-') return null
  const s = String(brDate).trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  const [d, m, y] = s.split('/')
  if (!d || !m || !y) return null
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}
