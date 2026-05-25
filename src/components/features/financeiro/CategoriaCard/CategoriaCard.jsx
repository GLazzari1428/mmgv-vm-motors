import { Card } from '@components/common/Card'
import { Icon } from '@components/common/Icon'
import { formatMoeda } from '@utils/formatters'
import styles from './CategoriaCard.module.css'

// card de categoria com mini barra proporcional ao maior valor
export const CategoriaCard = ({ categoria, maxValor }) => {
  const largura = maxValor > 0 ? (categoria.valor / maxValor) * 100 : 0

  return (
    <Card className={styles.card}>
      <div className={styles.top}>
        <span className={styles.iconWrap}>
          <Icon name={categoria.icone} size={16} />
        </span>
        <span className={styles.nome}>{categoria.nome}</span>
      </div>

      <p className={styles.valor}>{formatMoeda(categoria.valor)}</p>

      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${largura}%` }} />
      </div>
    </Card>
  )
}
