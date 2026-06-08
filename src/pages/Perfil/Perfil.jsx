import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Button } from '@components/common/Button'
import { Modal } from '@components/common/Modal'
import { useTheme } from '@hooks/useTheme'
import { useCarsStore } from '@store/carsStore'
import { useAuthStore } from '@store/authStore'
import { usePrefsStore } from '@store/prefsStore'
import { authService } from '@services/authService'
import { getErro } from '@services/api'
import styles from './Perfil.module.css'

export const Perfil = () => {
  const navigate = useNavigate()

  // toggle real ligado ao store de tema
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const totalCarros = useCarsStore((s) => s.carros.length)
  const resetCars = useCarsStore((s) => s.reset)

  const usuario = useAuthStore((s) => s.usuario)
  const setUsuario = useAuthStore((s) => s.setUsuario)
  const logout = useAuthStore((s) => s.logout)

  // preferencia de notificacoes, persistida no localStorage
  const notificacoes = usePrefsStore((s) => s.notificacoes)
  const toggleNotificacoes = usePrefsStore((s) => s.toggleNotificacoes)

  // qual modal de conta esta aberto
  const [aba, setAba] = useState(null) // 'perfil' | 'senha' | null
  const [nome, setNome] = useState(usuario?.nome || '')
  const [email, setEmail] = useState(usuario?.email || '')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [msg, setMsg] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const abrir = (alvo) => {
    setErro('')
    setMsg('')
    setNome(usuario?.nome || '')
    setEmail(usuario?.email || '')
    setSenhaAtual('')
    setNovaSenha('')
    setAba(alvo)
  }

  const salvarPerfil = async (e) => {
    e.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      const atualizado = await authService.updatePerfil(nome.trim(), email.trim())
      setUsuario(atualizado)
      setMsg('Perfil atualizado')
      setAba(null)
    } catch (err) {
      setErro(getErro(err, 'Não foi possível atualizar'))
    } finally {
      setSalvando(false)
    }
  }

  const salvarSenha = async (e) => {
    e.preventDefault()
    setErro('')
    setSalvando(true)
    try {
      await authService.updateSenha(senhaAtual, novaSenha)
      setMsg('Senha alterada')
      setAba(null)
    } catch (err) {
      setErro(getErro(err, 'Não foi possível alterar a senha'))
    } finally {
      setSalvando(false)
    }
  }

  const sair = () => {
    logout()
    resetCars()
    navigate('/login')
  }

  return (
    <AppShell header={<Header left="menu" title="Perfil" right="avatar" />}>
      <div className={styles.page}>
        <Card className={styles.userCard}>
          <span className={styles.avatar}>
            <User size={26} />
          </span>
          <div className={styles.userInfo}>
            <p className={styles.nome}>{usuario?.nome || 'Usuário'}</p>
            <p className={styles.email}>{usuario?.email || ''}</p>
          </div>
          <div className={styles.veiculos}>
            <Car size={14} />
            {totalCarros}
          </div>
        </Card>

        <section>
          <SectionLabel>preferências</SectionLabel>
          <Card className={styles.group}>
            <div className={styles.row}>
              <div className={styles.rowLeft}>
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
                <span>Modo escuro</span>
              </div>
              <button
                className={`${styles.toggle} ${isDark ? styles.on : ''}`}
                onClick={toggleTheme}
                aria-label="Alternar tema"
              >
                <span className={styles.knob} />
              </button>
            </div>

            <div className={styles.divider} />

            <div className={styles.row}>
              <div className={styles.rowLeft}>
                <Bell size={18} />
                <span>Notificações</span>
              </div>
              <button
                className={`${styles.toggle} ${notificacoes ? styles.on : ''}`}
                onClick={toggleNotificacoes}
                aria-label="Alternar notificações"
              >
                <span className={styles.knob} />
              </button>
            </div>
          </Card>
        </section>

        <section>
          <SectionLabel>conta</SectionLabel>
          <Card className={styles.group}>
            <button className={styles.linkRow} onClick={() => abrir('perfil')}>
              <div className={styles.rowLeft}>
                <UserCog size={18} />
                <span>Editar perfil</span>
              </div>
              <ChevronRight size={18} className={styles.chevron} />
            </button>

            <div className={styles.divider} />

            <button className={styles.linkRow} onClick={() => abrir('senha')}>
              <div className={styles.rowLeft}>
                <KeyRound size={18} />
                <span>Alterar senha</span>
              </div>
              <ChevronRight size={18} className={styles.chevron} />
            </button>

            {msg && <p className={styles.msg}>{msg}</p>}
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

        <button className={styles.sair} onClick={sair}>
          <LogOut size={18} />
          Sair
        </button>
      </div>

      <Modal aberto={aba === 'perfil'} onFechar={() => setAba(null)} titulo="Editar perfil">
        <form className={styles.form} onSubmit={salvarPerfil}>
          <label className={styles.field}>
            <span>Nome</span>
            <input value={nome} onChange={(e) => setNome(e.target.value)} />
          </label>
          <label className={styles.field}>
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          {erro && <p className={styles.erro}>{erro}</p>}
          <Button type="submit" variant="primary" fullWidth disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </Button>
        </form>
      </Modal>

      <Modal aberto={aba === 'senha'} onFechar={() => setAba(null)} titulo="Alterar senha">
        <form className={styles.form} onSubmit={salvarSenha}>
          <label className={styles.field}>
            <span>Senha atual</span>
            <input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span>Nova senha</span>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
          </label>
          {erro && <p className={styles.erro}>{erro}</p>}
          <Button type="submit" variant="primary" fullWidth disabled={salvando}>
            {salvando ? 'Salvando...' : 'Alterar'}
          </Button>
        </form>
      </Modal>
    </AppShell>
  )
}
