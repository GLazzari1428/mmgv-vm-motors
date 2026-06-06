import { Card } from '@components/common/Card'
import { Icon } from '@components/common/Icon'
import { formatMoeda } from '@utils/formatters'
import styles from './CategoriaCard.module.css'

// card de categoria com barra proporcional ao maior valor.
// clicavel para filtrar as transacoes por categoria
export const CategoriaCard = ({ categoria, maxValor, ativo, onClick }) => {
  const largura = maxValor > 0 ? (categoria.valor / maxValor) * 100 : 0

  return (
    <Card
      className={`${styles.card} ${ativo ? styles.ativo : ''}`}
      onClick={onClick}
    >
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
