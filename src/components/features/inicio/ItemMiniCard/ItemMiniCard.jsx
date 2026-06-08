import { Card } from '@components/common/Card'
import { StatusPill } from '@components/common/StatusPill'
import { Icon } from '@components/common/Icon'
import { statusInfo, formatKm } from '@utils/formatters'
import styles from './ItemMiniCard.module.css'

// card pequeno de item de manutencao usado na grade 2x2 do inicio
export const ItemMiniCard = ({ item, onClick }) => {
  const bar = statusInfo[item.status]?.bar

  return (
    <Card barColor={bar} onClick={onClick}>
      <div className={styles.top}>
        <Icon name={item.icone} size={18} className={styles.icon} />
        <StatusPill status={item.status} />
      </div>
      <p className={styles.nome}>{item.nome}</p>
      <p className={styles.label}>Próxima troca</p>
      <p className={styles.data}>{item.proximaTroca}</p>
      {item.km && <p className={styles.data}>{formatKm(item.km)}</p>}
    </Card>
  )
}
