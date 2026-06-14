import { Car, ChevronRight } from 'lucide-react'
import { Card } from '@components/common/Card'
import { StatusPill } from '@components/common/StatusPill'
import { piorStatus, statusInfo } from '@utils/formatters'
import styles from './CarListCard.module.css'

// card de carro na lista de meus carros, com chips dos itens monitorados
export const CarListCard = ({ carro, onClick }) => {
  const status = piorStatus(carro.itens)

  return (
    <Card barColor={statusInfo[status].bar} onClick={onClick} className={styles.card}>
      <div className={styles.top}>
        <div className={styles.left}>
          {carro.foto ? (
            <img src={carro.foto} alt="" className={styles.carThumb} />
          ) : (
            <span className={styles.carIcon}>
              <Car size={20} />
            </span>
          )}
          <div>
            <p className={styles.modelo}>{carro.modelo}</p>
            <p className={styles.placa}>{carro.placa}</p>
          </div>
        </div>
        <div className={styles.right}>
          <StatusPill status={status} />
          <ChevronRight size={18} className={styles.chevron} />
        </div>
      </div>

      <div className={styles.chips}>
        {carro.itens.map((item) => (
          <span
            key={item.id}
            className={styles.chip}
            data-bar={statusInfo[item.status].bar}
          >
            {item.nome}
          </span>
        ))}
      </div>
    </Card>
  )
}
