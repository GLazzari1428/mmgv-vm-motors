import { BottomNav } from '@components/layout/BottomNav'
import styles from './AppShell.module.css'

// estrutura da tela: header fixo no topo, conteudo rolavel, nav fixa embaixo
export const AppShell = ({ header, children, showNav = true }) => {
  return (
    <div className={styles.shell}>
      {header}
      <main className={`${styles.content} ${showNav ? styles.withNav : ''}`}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  )
}
