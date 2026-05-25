import { TrendingDown, TrendingUp } from 'lucide-react'
import { formatMoeda } from '@utils/formatters'
import styles from './ResumoFinanceiro.module.css'

// bloco com total do mes e comparativo com o mes anterior
export const ResumoFinanceiro = ({ totalMes, mesAnterior }) => {
  const diff = totalMes - mesAnterior
  const pct = mesAnterior > 0 ? Math.round((diff / mesAnterior) * 100) : 0
  const gastouMenos = diff <= 0

  return (
    <div className={styles.bloco}>
      <p className={styles.label}>total gasto no mes</p>
      <p className={styles.total}>{formatMoeda(totalMes)}</p>

      <span className={`${styles.pill} ${gastouMenos ? styles.down : styles.up}`}>
        {gastouMenos ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
        {Math.abs(pct)}% vs mes anterior
      </span>
    </div>
  )
}
