import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Car } from 'lucide-react'
import { Button } from '@components/common/Button'
import { useAuthStore } from '@store/authStore'
import { getErro } from '@services/api'
import styles from './Cadastro.module.css'

export const Cadastro = () => {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirma, setConfirma] = useState('')
  const [aceito, setAceito] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const senhasConferem = senha !== '' && senha === confirma
  const preenchido = nome.trim() !== '' && email.trim() !== ''
  const podeCadastrar = preenchido && senhasConferem && aceito && !enviando

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!podeCadastrar) return
    setErro('')
    setEnviando(true)
    try {
      await register(nome.trim(), email.trim(), senha)
      navigate('/inicio')
    } catch (err) {
      setErro(getErro(err, 'Não foi possível criar a conta'))
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
        <span className={styles.brand}>Criar conta</span>
        <span className={styles.tagline}>Comece a cuidar dos seus veículos</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Nome</span>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="seu nome"
          />
        </label>

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

        <label className={styles.field}>
          <span>Confirmar senha</span>
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

        <label className={styles.termos}>
          <input
            type="checkbox"
            checked={aceito}
            onChange={(e) => setAceito(e.target.checked)}
          />
          <span>aceito os termos de uso</span>
        </label>

        {erro && <span className={styles.erro}>{erro}</span>}

        <Button type="submit" variant="primary" fullWidth disabled={!podeCadastrar}>
          {enviando ? 'Criando conta...' : 'Cadastrar'}
        </Button>
      </form>

      <p className={styles.link}>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  )
}
