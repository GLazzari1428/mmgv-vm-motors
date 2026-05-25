import styles from './StatusPill.module.css'
import { statusInfo } from '@utils/formatters'

// pill de status: ok, warn ou late
export const StatusPill = ({ status }) => {
  const info = statusInfo[status] || statusInfo.ok
  return <span className={`${styles.pill} ${styles[status]}`}>{info.label}</span>
}
