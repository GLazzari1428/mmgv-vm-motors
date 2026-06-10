import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Car } from 'lucide-react'
import { Button } from '@components/common/Button'
import { useAuthStore } from '@store/authStore'
import { getErro } from '@services/api'
import styles from './Login.module.css'

export const Login = () => {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const podeEntrar = email.trim() !== '' && senha.trim() !== '' && !enviando

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!podeEntrar) return
    setErro('')
    setEnviando(true)
    try {
      await login(email.trim(), senha)
      navigate('/inicio')
    } catch (err) {
      setErro(getErro(err, 'Email ou senha inválidos'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>
          <Car size={28} />
        </span>
        <span className={styles.brand}>VM Motors</span>
        <span className={styles.tagline}>Gestão de manutenção veicular</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </label>

        <label className={styles.field}>
          <span>Senha</span>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="********"
          />
        </label>

        <button
          type="button"
          className={styles.esqueci}
          onClick={() => navigate('/recuperar-senha')}
        >
          Esqueci minha senha
        </button>

        {erro && <p className={styles.erro}>{erro}</p>}

        <Button type="submit" variant="primary" fullWidth disabled={!podeEntrar}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <p className={styles.link}>
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  )
}
