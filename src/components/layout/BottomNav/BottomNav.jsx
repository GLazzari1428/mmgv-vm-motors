import { NavLink } from 'react-router-dom'
import { Home, Car, Wrench, Wallet, User } from 'lucide-react'
import styles from './BottomNav.module.css'

const tabs = [
  { to: '/inicio', label: 'Inicio', icon: Home },
  { to: '/meus-carros', label: 'Meus carros', icon: Car },
  { to: '/manutencao', label: 'Manutencao', icon: Wrench },
  { to: '/financeiro', label: 'Financeiro', icon: Wallet },
  { to: '/perfil', label: 'Perfil', icon: User },
]

export const BottomNav = () => {
  return (
    <nav className={styles.nav}>
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }
        >
          <Icon size={20} />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
