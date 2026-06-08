import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import { Button } from '@components/common/Button'
import { authService } from '@services/authService'
import { getErro } from '@services/api'
import styles from './RecuperarSenha.module.css'

export const RecuperarSenha = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirma, setConfirma] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const senhasConferem = senha !== '' && senha === confirma
  const pode = email.trim() !== '' && senhasConferem && !enviando

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!pode) return
    setErro('')
    setEnviando(true)
    try {
      await authService.resetSenha(email.trim(), senha)
      navigate('/login')
    } catch (err) {
      setErro(getErro(err, 'Não foi possível redefinir a senha'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>
          <KeyRound size={28} />
        </span>
        <span className={styles.brand}>Recuperar senha</span>
        <span className={styles.tagline}>Defina uma nova senha para a sua conta</span>
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
          <span>Nova senha</span>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="********"
          />
        </label>

        <label className={styles.field}>
          <span>Confirmar nova senha</span>
          <input
            type="password"
            value={confirma}
            onChange={(e) => setConfirma(e.target.value)}
            placeholder="********"
          />
          {confirma !== '' && !senhasConferem && (
            <span className={styles.erro}>As senhas não conferem</span>
          )}
        </label>

        {erro && <p className={styles.erro}>{erro}</p>}

        <Button type="submit" variant="primary" fullWidth disabled={!pode}>
          {enviando ? 'Redefinindo...' : 'Redefinir senha'}
        </Button>
      </form>

      <p className={styles.link}>
        Lembrou a senha? <Link to="/login">Entrar</Link>
      </p>
    </div>
  )
}
