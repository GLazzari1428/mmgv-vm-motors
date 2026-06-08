import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AppShell } from '@components/layout/AppShell'
import { Header } from '@components/layout/Header'
import { SectionLabel } from '@components/common/SectionLabel'
import { Button } from '@components/common/Button'
import { Modal } from '@components/common/Modal'
import { ResumoCard } from '@components/features/manutencao/ResumoCard'
import { ItemRow } from '@components/features/manutencao/ItemRow'
import { useCarsStore } from '@store/carsStore'
import { maintenanceService } from '@services/maintenanceService'
import { getErro } from '@services/api'
import styles from './Manutencao.module.css'

// converte 'DD/MM/YYYY' para 'YYYY-MM-DD' (formato do input date), ou vazio
function paraInputDate(br) {
  if (!br || br === '-') return ''
  const [d, m, y] = br.split('/')
  if (!d || !m || !y) return ''
  return `${y}-${m}-${d}`
}

const INTERVALOS = {
  oleo:        { dias: 180, label: 'Sugestão: óleo a cada 6 meses' },
  pneu:        { dias: 730, label: 'Sugestão: pneus a cada 2 anos' },
  filtro:      { dias: 365, label: 'Sugestão: filtro a cada 1 ano' },
  correia:     { dias: 730, label: 'Sugestão: correia a cada 2 anos' },
  alinhamento: { dias: 180, label: 'Sugestão: alinhamento a cada 6 meses' },
}

export const Manutencao = () => {
  const carro = useCarsStore((s) => s.getSelectedCar())
  const refreshCar = useCarsStore((s) => s.refreshCar)

  const [aberto, setAberto] = useState(false)
  const [itemId, setItemId] = useState('')
  const [ultima, setUltima] = useState('')
  const [proxima, setProxima] = useState('')
  const [km, setKm] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  if (!carro) {
    return (
      <AppShell header={<Header left="back" title="Manutenção" right="avatar" />}>
        <p className={styles.subtitulo}>Nenhum carro selecionado</p>
      </AppShell>
    )
  }

  // abre o modal ja apontando para um item, preenchendo as datas atuais dele
  const abrirItem = (item) => {
    setItemId(String(item.id))
    setUltima(paraInputDate(item.ultimaTroca))
    setProxima(paraInputDate(item.proximaTroca))
    setKm(item.km ? String(item.km) : '')
    setErro('')
    setAberto(true)
  }

  const itemSelecionado = carro.itens.find((i) => String(i.id) === String(itemId))
  const intervalo = INTERVALOS[itemSelecionado?.codigo]

  // auto-preenche proxima troca com base no intervalo padrao do tipo de item
  const handleUltimaChange = (valor) => {
    setUltima(valor)
    if (!proxima && valor && intervalo) {
      const d = new Date(valor)
      d.setDate(d.getDate() + intervalo.dias)
      setProxima(d.toISOString().slice(0, 10))
    }
  }

  const salvar = async (e) => {
    e.preventDefault()
    if (!itemId) return
    setErro('')
    setSalvando(true)
    try {
      await maintenanceService.atualizarItem(itemId, {
        ultimaTroca: ultima || null,
        proximaTroca: proxima || null,
        km: km ? Number(km) : null,
      })
      await refreshCar(carro.id)
      setAberto(false)
    } catch (err) {
      setErro(getErro(err, 'Não foi possível registrar'))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <AppShell header={<Header left="back" title="Manutenção" right="avatar" />}>
      <div className={styles.page}>
        <p className={styles.subtitulo}>
          {carro.modelo} - {carro.placa}
        </p>

        <ResumoCard itens={carro.itens} />

        <section>
          <SectionLabel>todos os itens</SectionLabel>
          <div className={styles.lista}>
            {carro.itens.map((item) => (
              <ItemRow key={item.id} item={item} onClick={() => abrirItem(item)} />
            ))}
          </div>
        </section>

        <div className={styles.acoes}>
          <Button variant="primary" fullWidth onClick={() => abrirItem(carro.itens[0])}>
            <Plus size={18} />
            Registrar nova manutenção
          </Button>
        </div>
      </div>

      <Modal
        aberto={aberto}
        onFechar={() => setAberto(false)}
        titulo={itemSelecionado ? `Registrar troca: ${itemSelecionado.nome}` : 'Registrar troca'}
      >
        <form className={styles.form} onSubmit={salvar}>
          <label className={styles.field}>
            <span>Item</span>
            <select value={itemId} onChange={(e) => setItemId(e.target.value)}>
              {carro.itens.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.linha}>
            <label className={styles.field}>
              <span>Última troca</span>
              <input type="date" value={ultima} onChange={(e) => handleUltimaChange(e.target.value)} />
            </label>
            <label className={styles.field}>
              <span>Próxima troca</span>
              <input type="date" value={proxima} onChange={(e) => setProxima(e.target.value)} />
              {intervalo && <p className={styles.dica}>{intervalo.label}</p>}
            </label>
          </div>

          <label className={styles.field}>
            <span>KM ao registrar</span>
            <input
              type="number"
              min="0"
              placeholder="ex: 45000"
              value={km}
              onChange={(e) => setKm(e.target.value)}
            />
          </label>

          {erro && <p className={styles.erro}>{erro}</p>}

          <Button type="submit" variant="primary" fullWidth disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar registro'}
          </Button>
        </form>
      </Modal>
    </AppShell>
  )
}
