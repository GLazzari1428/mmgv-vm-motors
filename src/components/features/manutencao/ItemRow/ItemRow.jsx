import { ChevronRight } from 'lucide-react'
import { Card } from '@components/common/Card'
import { StatusPill } from '@components/common/StatusPill'
import { Icon } from '@components/common/Icon'
import { statusInfo, formatKm } from '@utils/formatters'
import styles from './ItemRow.module.css'

// linha de item na lista de manutencao, clicavel para registrar a troca
export const ItemRow = ({ item, onClick }) => {
  const bar = statusInfo[item.status].bar

  return (
    <Card barColor={bar} className={styles.row} onClick={onClick}>
      <span className={styles.iconWrap} data-bar={bar}>
        <Icon name={item.icone} size={18} />
      </span>

      <div className={styles.info}>
        <p className={styles.nome}>{item.nome}</p>
        <p className={styles.sub}>
          Última troca: {item.ultimaTroca}
          {item.km ? ` · ${formatKm(item.km)}` : ''}
        </p>
      </div>

      <div className={styles.right}>
        <StatusPill status={item.status} />
        <ChevronRight size={18} className={styles.chevron} />
      </div>
    </Card>
  )
}
