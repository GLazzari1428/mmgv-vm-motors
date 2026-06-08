import { useState } from 'react'
import { Button } from '@components/common/Button'
import { getErro } from '@services/api'
import styles from './CarForm.module.css'

// formulario de carro reutilizado nos modais de adicionar e editar.
// inicial: valores iniciais; onSalvar: recebe o payload e pode lancar erro.
export const CarForm = ({ inicial, editando, onSalvar }) => {
  const [modelo, setModelo] = useState(inicial.modelo)
  const [placa, setPlaca] = useState(inicial.placa)
  const [ano, setAno] = useState(inicial.ano)
  const [cor, setCor] = useState(inicial.cor)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const podeSalvar = modelo.trim() !== '' && placa.trim() !== '' && !enviando

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!podeSalvar) return
    setErro('')
    setEnviando(true)
    try {
      await onSalvar({ modelo: modelo.trim(), placa: placa.trim(), ano, cor: cor.trim() })
    } catch (err) {
      setErro(
        getErro(
          err,
          editando ? 'Não foi possível salvar as alterações' : 'Não foi possível salvar o carro'
        )
      )
      setEnviando(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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

      {erro && <p className={styles.erro}>{erro}</p>}

      <Button type="submit" variant="primary" fullWidth disabled={!podeSalvar}>
        {enviando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Adicionar veículo'}
      </Button>
    </form>
  )
}
