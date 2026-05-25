import { Card } from '@components/common/Card'
import styles from './QuickAccessCard.module.css'

// card grande de acesso rapido, icone centralizado e label embaixo
export const QuickAccessCard = ({ icon: Icon, label, onClick }) => {
  return (
    <Card className={styles.card} onClick={onClick} as="button">
      <Icon size={26} className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </Card>
  )
}
