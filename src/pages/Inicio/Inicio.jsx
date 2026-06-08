import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, Wrench, ChevronRight } from 'lucide-react'
import { AppShell } from '@components/layout/AppShell'
import { Header } from '@components/layout/Header'
import { SectionLabel } from '@components/common/SectionLabel'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { Modal } from '@components/common/Modal'
import { BarChart } from '@components/common/BarChart'
import { CarSelector } from '@components/features/inicio/CarSelector'
import { StatusBanner } from '@components/features/inicio/StatusBanner'
import { ItemMiniCard } from '@components/features/inicio/ItemMiniCard'
import { useCarsStore } from '@store/carsStore'
import { financeService } from '@services/financeService'
import { maintenanceService } from '@services/maintenanceService'
import { contarStatus, formatMoeda } from '@utils/formatters'
import styles from './Inicio.module.css'

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const mesLabel = (ym) => MESES[Number(ym.slice(5, 7)) - 1] || ym

export const Inicio = () => {
  const navigate = useNavigate()
  const carro = useCarsStore((s) => s.getSelectedCar())
  const carId = carro?.id
  const loading = useCarsStore((s) => s.loading)

  const [gastos, setGastos] = useState([])
  const [modal, setModal] = useState(null) // 'gastos' | 'manutencao'
  const [itemHist, setItemHist] = useState(null) // { item, dados }

  useEffect(() => {
    if (!carId) return
    let ativo = true
    financeService
      .historico(carId)
      .then((d) => ativo && setGastos(d))
      .catch(() => {})
    return () => {
      ativo = false
    }
  }, [carId])

  if (!carro) {
    return (
      <AppShell header={<Header left="menu" right="avatar" />}>
        <div className={styles.page}>
          {loading ? (
            <p className={styles.vazio}>Carregando...</p>
          ) : (
            <div className={styles.vazio}>
              <p>Você ainda não tem carros cadastrados</p>
              <Button variant="primary" onClick={() => navigate('/meus-carros')}>
                Adicionar veículo
              </Button>
            </div>
          )}
        </div>
      </AppShell>
    )
  }

  const recentes = carro.itens.slice(0, 4)
  const contagem = contarStatus(carro.itens)
  const gastosChart = gastos.map((g) => ({ label: mesLabel(g.mes), valor: g.total }))
  const statusChart = [
    { label: 'Em dia', valor: contagem.ok },
    { label: 'Alerta', valor: contagem.warn },
    { label: 'Vencido', valor: contagem.late },
  ]

  // abre o modal de historico (read-only) de um item de manutencao
  const abrirItemHist = async (item) => {
    setItemHist({ item, dados: null })
    try {
      const h = await maintenanceService.historico(item.id)
      setItemHist({
        item,
        dados: h.map((x) => ({ label: x.data.slice(0, 5), valor: x.intervaloDias })),
      })
    } catch {
      setItemHist({ item, dados: [] })
    }
  }

  return (
    <AppShell header={<Header left="menu" right="avatar" />}>
      <div className={styles.page}>
        <CarSelector />
        <StatusBanner carro={carro} />

        <section>
          <SectionLabel>manutenção recente</SectionLabel>
          <div className={styles.grid}>
            {recentes.map((item) => (
              <ItemMiniCard key={item.id} item={item} onClick={() => abrirItemHist(item)} />
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>resumo</SectionLabel>
          <div className={styles.resumo}>
            <Card className={styles.resumoCard} onClick={() => setModal('gastos')}>
              <div className={styles.resumoTop}>
                <span className={styles.resumoTitulo}>
                  <Wallet size={16} />
                  Gastos por mês
                </span>
                <ChevronRight size={16} className={styles.chevron} />
              </div>
              <BarChart dados={gastosChart} formatar={formatMoeda} altura={90} />
            </Card>

            <Card className={styles.resumoCard} onClick={() => setModal('manutencao')}>
              <div className={styles.resumoTop}>
                <span className={styles.resumoTitulo}>
                  <Wrench size={16} />
                  Estado da manutenção
                </span>
                <ChevronRight size={16} className={styles.chevron} />
              </div>
              <BarChart dados={statusChart} altura={90} />
            </Card>
          </div>
        </section>
      </div>

      <Modal
        aberto={modal === 'gastos'}
        onFechar={() => setModal(null)}
        titulo="Gastos por mês"
      >
        <p className={styles.modalSub}>Últimos 6 meses de {carro.modelo}</p>
        <BarChart dados={gastosChart} formatar={formatMoeda} altura={220} />
      </Modal>

      <Modal
        aberto={modal === 'manutencao'}
        onFechar={() => setModal(null)}
        titulo="Estado da manutenção"
      >
        <p className={styles.modalSub}>{carro.itens.length} itens acompanhados</p>
        <BarChart dados={statusChart} altura={220} />
      </Modal>

      <Modal
        aberto={!!itemHist}
        onFechar={() => setItemHist(null)}
        titulo={itemHist ? itemHist.item.nome : ''}
      >
        <p className={styles.modalSub}>Intervalo entre trocas (em dias)</p>
        {itemHist?.dados === null ? (
          <p className={styles.vazio}>Carregando...</p>
        ) : (
          <BarChart dados={itemHist?.dados || []} altura={220} cor="var(--bar-yellow)" />
        )}
      </Modal>
    </AppShell>
  )
}
