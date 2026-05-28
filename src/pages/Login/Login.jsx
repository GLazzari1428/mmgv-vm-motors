import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Car } from 'lucide-react'
import { Button } from '@components/common/Button'
import styles from './Login.module.css'

export const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const podeEntrar = email.trim() !== '' && senha.trim() !== ''

  // aceita qualquer coisa e entra, auth real fica pro backend
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!podeEntrar) return
    navigate('/inicio')
  }

  return (
    <div className={styles.page}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>
          <Car size={28} />
        </span>
        <span className={styles.brand}>VM Motors</span>
        <span className={styles.tagline}>gestao de manutencao veicular</span>
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

        <button type="button" className={styles.esqueci}>
          Esqueci minha senha
        </button>

        <Button type="submit" variant="primary" fullWidth disabled={!podeEntrar}>
          Entrar
        </Button>
      </form>

      <p className={styles.link}>
        nao tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  )
}
