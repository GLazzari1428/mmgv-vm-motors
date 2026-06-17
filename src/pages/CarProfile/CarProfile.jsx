import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Car, Pencil, Trash2, Wrench, Wallet, ChevronRight } from 'lucide-react'
import { AppShell } from '@components/layout/AppShell'
import { Header } from '@components/layout/Header'
import { SectionLabel } from '@components/common/SectionLabel'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { Modal } from '@components/common/Modal'
import { CarForm } from '@components/features/carros/CarForm'
import { useCarsStore } from '@store/carsStore'
import styles from './CarProfile.module.css'

export const CarProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const carros = useCarsStore((s) => s.carros)
  const loading = useCarsStore((s) => s.loading)
  const selectCar = useCarsStore((s) => s.selectCar)
  const updateCar = useCarsStore((s) => s.updateCar)
  const removeCar = useCarsStore((s) => s.removeCar)

  const carro = carros.find((c) => String(c.id) === String(id))
  const [editando, setEditando] = useState(false)

  if (!carro) {
    return (
      <AppShell header={<Header left="back" title="Veículo" right="avatar" />}>
        <p className={styles.aviso}>{loading ? 'Carregando...' : 'Carro não encontrado'}</p>
      </AppShell>
    )
  }

  // seleciona este carro e vai pra tela pedida
  const irPara = (rota) => {
    selectCar(carro.id)
    navigate(rota)
  }

  const salvarEdicao = async (payload) => {
    await updateCar(carro.id, { ...payload, proximaRevisao: carro.proximaRevisao })
    setEditando(false)
  }

  const excluir = async () => {
    if (!window.confirm(`Excluir o veículo ${carro.modelo}? A manutenção e o financeiro dele também serão removidos.`)) {
      return
    }
    try {
      await removeCar(carro.id)
      navigate('/meus-carros')
    } catch {
      window.alert('Não foi possível excluir o veículo')
    }
  }

  const inicial = {
    modelo: carro.modelo,
    placa: carro.placa,
    ano: carro.ano != null ? String(carro.ano) : '',
    cor: carro.cor && carro.cor !== '-' ? carro.cor : '',
    foto: carro.foto ?? null,
  }

  return (
    <AppShell header={<Header left="back" title="Veículo" right="avatar" />}>
      <div className={styles.page}>
        <Card className={styles.perfil}>
          {carro.foto ? (
            <img src={carro.foto} alt="" className={styles.fotoCarro} />
          ) : (
            <span className={styles.avatar}>
              <Car size={30} />
            </span>
          )}
          <p className={styles.modelo}>{carro.modelo}</p>
          <p className={styles.placa}>{carro.placa}</p>
        </Card>

        <section>
          <SectionLabel>Informações</SectionLabel>
          <Card className={styles.infos}>
            <div className={styles.linhaInfo}>
              <span>Ano</span>
              <strong>{carro.ano || '-'}</strong>
            </div>
            <div className={styles.divider} />
            <div className={styles.linhaInfo}>
              <span>Cor</span>
              <strong>{carro.cor || '-'}</strong>
            </div>
            <div className={styles.divider} />
            <div className={styles.linhaInfo}>
              <span>Próxima revisão</span>
              <strong>{carro.proximaRevisao}</strong>
            </div>
          </Card>
        </section>

        <section>
          <SectionLabel>Acessos</SectionLabel>
          <Card className={styles.group}>
            <button className={styles.linkRow} onClick={() => irPara('/manutencao')}>
              <div className={styles.rowLeft}>
                <Wrench size={18} />
                <span>Manutenção</span>
              </div>
              <ChevronRight size={18} className={styles.chevron} />
            </button>
            <div className={styles.divider} />
            <button className={styles.linkRow} onClick={() => irPara('/financeiro')}>
              <div className={styles.rowLeft}>
                <Wallet size={18} />
                <span>Financeiro</span>
              </div>
              <ChevronRight size={18} className={styles.chevron} />
            </button>
          </Card>
        </section>

        <div className={styles.acoes}>
          <Button variant="secondary" fullWidth onClick={() => setEditando(true)}>
            <Pencil size={18} />
            Editar veículo
          </Button>
          <Button variant="danger" fullWidth onClick={excluir}>
            <Trash2 size={18} />
            Excluir veículo
          </Button>
        </div>
      </div>

      <Modal aberto={editando} onFechar={() => setEditando(false)} titulo="Editar veículo">
        <CarForm inicial={inicial} editando onSalvar={salvarEdicao} />
      </Modal>
    </AppShell>
  )
}
