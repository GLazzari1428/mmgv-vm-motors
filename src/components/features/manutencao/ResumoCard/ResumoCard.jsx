import { contarStatus } from '@utils/formatters'
import styles from './ResumoCard.module.css'

// card escuro com o resumo dos itens verificados
export const ResumoCard = ({ itens }) => {
  const contagem = contarStatus(itens)

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <span className={styles.numero}>{itens.length}</span>
        <span className={styles.legenda}>itens verificados</span>
      </div>

      <div className={styles.right}>
        <div className={styles.linha}>
          <span className={`${styles.dot} ${styles.late}`} />
          {contagem.late} vencido
        </div>
        <div className={styles.linha}>
          <span className={`${styles.dot} ${styles.warn}`} />
          {contagem.warn} alerta
        </div>
        <div className={styles.linha}>
          <span className={`${styles.dot} ${styles.ok}`} />
          {contagem.ok} em dia
        </div>
      </div>
    </div>
  )
}
