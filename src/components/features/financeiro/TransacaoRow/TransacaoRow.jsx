import { Trash2 } from 'lucide-react'
import { Icon } from '@components/common/Icon'
import { formatMoeda } from '@utils/formatters'
import styles from './TransacaoRow.module.css'

// linha de transacao recente, com botao de excluir opcional
export const TransacaoRow = ({ transacao, onDelete }) => {
  return (
    <div className={styles.row}>
      <span className={styles.iconWrap}>
        <Icon name={transacao.icone} size={16} />
      </span>

      <div className={styles.info}>
        <p className={styles.desc}>{transacao.descricao}</p>
        <p className={styles.data}>{transacao.data}</p>
      </div>

      <span className={styles.valor}>{formatMoeda(transacao.valor)}</span>

      {onDelete && (
        <button className={styles.excluir} onClick={onDelete} aria-label="excluir transação">
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}
