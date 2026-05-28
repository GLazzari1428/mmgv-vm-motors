import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, User, Car } from 'lucide-react'
// import { Menu } from 'lucide-react' // menu hamburguer desativado por enquanto
import styles from './Header.module.css'

// header com 3 variacoes:
// left: menu ou back / center: logo ou titulo / right: avatar ou plus
export const Header = ({
  left = 'menu',
  title,
  right = 'avatar',
  onPlus,
}) => {
  const navigate = useNavigate()

  const handleBack = () => navigate(-1)
  const handleAvatar = () => navigate('/perfil')

  return (
    <header className={styles.header}>
      <div className={styles.side}>
        {left === 'back' && (
          <button className={styles.iconBtn} onClick={handleBack} aria-label="voltar">
            <ArrowLeft size={22} />
          </button>
        )}
        {/* menu hamburguer desativado por enquanto
        {left !== 'back' && (
          <button
            className={styles.iconBtn}
            onClick={() => console.log('menu')}
            aria-label="menu"
          >
            <Menu size={22} />
          </button>
        )}
        */}
      </div>

      <div className={styles.center}>
        {title ? (
          <h1 className={styles.title}>{title}</h1>
        ) : (
          <div className={styles.logo}>
            <Car size={24} />
            <span className={styles.badge} />
          </div>
        )}
      </div>

      <div className={`${styles.side} ${styles.right}`}>
        {right === 'plus' ? (
          <button
            className={styles.iconBtn}
            onClick={onPlus}
            aria-label="adicionar"
          >
            <Plus size={22} />
          </button>
        ) : (
          <button
            className={styles.avatar}
            onClick={handleAvatar}
            aria-label="perfil"
          >
            <User size={18} />
          </button>
        )}
      </div>
    </header>
  )
}
