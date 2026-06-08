import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import styles from './Modal.module.css'

export const Modal = ({ aberto, onFechar, titulo, children }) => {
  useEffect(() => {
    if (!aberto) return
    const onKey = (e) => {
      if (e.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', onKey)
    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = anterior
    }
  }, [aberto, onFechar])

  if (!aberto) return null

  return createPortal(
    <div className={styles.backdrop} onClick={onFechar}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.head}>
          <h2 className={styles.titulo}>{titulo}</h2>
          <button className={styles.fechar} onClick={onFechar} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <div className={styles.corpo}>{children}</div>
      </div>
    </div>,
    document.body
  )
}
