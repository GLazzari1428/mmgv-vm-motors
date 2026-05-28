import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@components/layout/AppShell'
import { Header } from '@components/layout/Header'
import { Button } from '@components/common/Button'
import { useCarsStore } from '@store/carsStore'
import styles from './AdicionarCarro.module.css'

export const AdicionarCarro = () => {
  const navigate = useNavigate()
  const addCar = useCarsStore((s) => s.addCar)

  const [modelo, setModelo] = useState('')
  const [placa, setPlaca] = useState('')
  const [ano, setAno] = useState('')
  const [cor, setCor] = useState('')

  const podeSalvar = modelo.trim() !== '' && placa.trim() !== ''

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!podeSalvar) return
    // adiciona de verdade no store e ja seleciona o novo carro
    addCar({ modelo, placa, ano, cor })
    navigate('/meus-carros')
  }

  return (
    <AppShell
      header={<Header left="back" title="Adicionar veiculo" right="avatar" />}
      showNav={false}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.campos}>
          <label className={styles.field}>
            <span>Modelo</span>
            <input
              type="text"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              placeholder="ex: Fiat Uno"
            />
          </label>

          <label className={styles.field}>
            <span>Placa</span>
            <input
              type="text"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              placeholder="ex: XXX-1B24"
            />
          </label>

          <div className={styles.linha}>
            <label className={styles.field}>
              <span>Ano</span>
              <input
                type="number"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                placeholder="ex: 2012"
              />
            </label>

            <label className={styles.field}>
              <span>Cor</span>
              <input
                type="text"
                value={cor}
                onChange={(e) => setCor(e.target.value)}
                placeholder="ex: Branco"
              />
            </label>
          </div>
        </div>

        <div className={styles.acao}>
          <Button type="submit" variant="primary" fullWidth disabled={!podeSalvar}>
            Salvar
          </Button>
        </div>
      </form>
    </AppShell>
  )
}
