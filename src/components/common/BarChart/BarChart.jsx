import styles from './BarChart.module.css'

export const BarChart = ({ dados = [], formatar, cor = 'var(--bar-green)', altura = 180 }) => {
  if (!dados.length) {
    return <p className={styles.vazio}>Sem dados pra mostrar</p>
  }

  const max = Math.max(...dados.map((d) => d.valor), 1)

  return (
    <div className={styles.grafico} style={{ height: altura }}>
      {dados.map((d, i) => {
        const altura = Math.max((d.valor / max) * 100, d.valor > 0 ? 4 : 0)
        return (
          <div key={i} className={styles.coluna}>
            <span className={styles.valor}>{formatar ? formatar(d.valor) : d.valor}</span>
            <div className={styles.trilha}>
              <div
                className={styles.barra}
                style={{ height: `${altura}%`, backgroundColor: cor }}
              />
            </div>
            <span className={styles.label}>{d.label}</span>
          </div>
        )
      })}
    </div>
  )
}
