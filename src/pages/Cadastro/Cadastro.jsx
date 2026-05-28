import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Car } from 'lucide-react'
import { Button } from '@components/common/Button'
import styles from './Cadastro.module.css'

export const Cadastro = () => {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirma, setConfirma] = useState('')
  const [aceito, setAceito] = useState(false)

  const senhasConferem = senha !== '' && senha === confirma
  const preenchido = nome.trim() !== '' && email.trim() !== ''
  const podeCadastrar = preenchido && senhasConferem && aceito

  // aceita qualquer coisa e cadastra, auth real fica pro backend
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!podeCadastrar) return
    navigate('/inicio')
  }

  return (
    <div className={styles.page}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>
          <Car size={28} />
        </span>
        <span className={styles.brand}>Criar conta</span>
        <span className={styles.tagline}>comece a cuidar dos seus veiculos</span>
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
            <span className={styles.erro}>as senhas nao conferem</span>
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

        <Button type="submit" variant="primary" fullWidth disabled={!podeCadastrar}>
          Cadastrar
        </Button>
      </form>

      <p className={styles.link}>
        ja tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  )
}
