import { useState } from 'react'
import {
  Moon,
  Sun,
  Bell,
  LogOut,
  User,
  Car,
  UserCog,
  KeyRound,
  ChevronRight,
  Info,
} from 'lucide-react'
import { AppShell } from '@components/layout/AppShell'
import { Header } from '@components/layout/Header'
import { SectionLabel } from '@components/common/SectionLabel'
import { Card } from '@components/common/Card'
import { useTheme } from '@hooks/useTheme'
import { useCarsStore } from '@store/carsStore'
import { usuarioMock } from '@utils/mockData'
import styles from './Perfil.module.css'

export const Perfil = () => {
  // toggle real ligado ao store de tema
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const totalCarros = useCarsStore((s) => s.carros.length)

  // toggle so visual por enquanto
  const [notificacoes, setNotificacoes] = useState(true)

  return (
    <AppShell header={<Header left="menu" title="Perfil" right="avatar" />}>
      <div className={styles.page}>
        <Card className={styles.userCard}>
          <span className={styles.avatar}>
            <User size={26} />
          </span>
          <div className={styles.userInfo}>
            <p className={styles.nome}>{usuarioMock.nome}</p>
            <p className={styles.email}>{usuarioMock.email}</p>
          </div>
          <div className={styles.veiculos}>
            <Car size={14} />
            {totalCarros}
          </div>
        </Card>

        <section>
          <SectionLabel>preferencias</SectionLabel>
          <Card className={styles.group}>
            <div className={styles.row}>
              <div className={styles.rowLeft}>
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
                <span>Modo escuro</span>
              </div>
              <button
                className={`${styles.toggle} ${isDark ? styles.on : ''}`}
                onClick={toggleTheme}
                aria-label="alternar tema"
              >
                <span className={styles.knob} />
              </button>
            </div>

            <div className={styles.divider} />

            <div className={styles.row}>
              <div className={styles.rowLeft}>
                <Bell size={18} />
                <span>Notificacoes</span>
              </div>
              <button
                className={`${styles.toggle} ${notificacoes ? styles.on : ''}`}
                onClick={() => setNotificacoes((v) => !v)}
                aria-label="alternar notificacoes"
              >
                <span className={styles.knob} />
              </button>
            </div>
          </Card>
        </section>

        <section>
          <SectionLabel>conta</SectionLabel>
          <Card className={styles.group}>
            <button className={styles.linkRow} onClick={() => console.log('editar perfil')}>
              <div className={styles.rowLeft}>
                <UserCog size={18} />
                <span>Editar perfil</span>
              </div>
              <ChevronRight size={18} className={styles.chevron} />
            </button>

            <div className={styles.divider} />

            <button className={styles.linkRow} onClick={() => console.log('alterar senha')}>
              <div className={styles.rowLeft}>
                <KeyRound size={18} />
                <span>Alterar senha</span>
              </div>
              <ChevronRight size={18} className={styles.chevron} />
            </button>
          </Card>
        </section>

        <section>
          <SectionLabel>sobre</SectionLabel>
          <Card className={styles.sobre}>
            <Info size={18} />
            <span>VM Motors</span>
            <span className={styles.versao}>v1.0.0</span>
          </Card>
        </section>

        <button className={styles.sair} onClick={() => console.log('sair')}>
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </AppShell>
  )
}
