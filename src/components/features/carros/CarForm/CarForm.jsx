import { useRef, useState } from 'react'
import { Camera, Car } from 'lucide-react'
import { Button } from '@components/common/Button'
import { getErro } from '@services/api'
import { compressImageToBase64 } from '@utils/image'
import styles from './CarForm.module.css'

// formulario de carro reutilizado nos modais de adicionar e editar.
// inicial: valores iniciais; onSalvar: recebe o payload e pode lancar erro.
export const CarForm = ({ inicial, editando, onSalvar }) => {
  const [modelo, setModelo] = useState(inicial.modelo)
  const [placa, setPlaca] = useState(inicial.placa)
  const [ano, setAno] = useState(inicial.ano)
  const [cor, setCor] = useState(inicial.cor)
  const [foto, setFoto] = useState(inicial.foto ?? null)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const fileRef = useRef(null)

  const podeSalvar = modelo.trim() !== '' && placa.trim() !== '' && !enviando

  const handleFoto = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const base64 = await compressImageToBase64(file, { maxSize: 512, quality: 0.8 })
      setFoto(base64)
    } catch {
      setErro('Não foi possível usar essa imagem')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!podeSalvar) return
    setErro('')
    setEnviando(true)
    try {
      await onSalvar({
        modelo: modelo.trim(),
        placa: placa.trim(),
        ano,
        cor: cor.trim(),
        foto,
      })
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
      <button
        type="button"
        className={styles.fotoArea}
        onClick={() => fileRef.current?.click()}
        aria-label={foto ? 'Trocar foto do carro' : 'Adicionar foto do carro'}
      >
        {foto ? (
          <img src={foto} alt="" className={styles.fotoImg} />
        ) : (
          <span className={styles.fotoPlaceholder}>
            <Car size={28} />
            <span>Adicionar foto</span>
          </span>
        )}
        <span className={styles.cameraBadge}>
          <Camera size={14} />
        </span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFoto}
        className={styles.fileInput}
      />

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
