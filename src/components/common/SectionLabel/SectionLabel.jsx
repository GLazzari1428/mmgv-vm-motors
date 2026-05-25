import styles from './SectionLabel.module.css'

// label pequena em caixa alta acima das secoes
export const SectionLabel = ({ children }) => {
  return <p className={styles.label}>{children}</p>
}
