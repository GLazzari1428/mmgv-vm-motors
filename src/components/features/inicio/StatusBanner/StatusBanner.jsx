import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { contarStatus } from '@utils/formatters'
import styles from './StatusBanner.module.css'

// banner que resume o estado geral do carro
export const StatusBanner = ({ carro }) => {
  const contagem = contarStatus(carro.itens)

  let tipo = 'ok'
  let titulo = 'Está tudo certo com seu carro!'
  if (contagem.late > 0) {
    tipo = 'late'
    titulo = 'Atenção, há itens vencidos'
  } else if (contagem.warn > 0) {
    tipo = 'warn'
    titulo = 'Alguns itens precisam de atenção'
  }

  const Icon = tipo === 'ok' ? CheckCircle : tipo === 'warn' ? AlertTriangle : XCircle

  return (
    <div className={`${styles.banner} ${styles[tipo]}`}>
      <Icon size={28} className={styles.icon} />
      <div>
        <p className={styles.titulo}>{titulo}</p>
        <p className={styles.sub}>Revisão em dia, próxima em {carro.proximaRevisao}</p>
      </div>
    </div>
  )
}
