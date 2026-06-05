import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { AppShell } from '@components/layout/AppShell'
import { Header } from '@components/layout/Header'
import { SectionLabel } from '@components/common/SectionLabel'
import { Modal } from '@components/common/Modal'
import { CarListCard } from '@components/features/meusCarros/CarListCard'
import { CarForm } from '@components/features/carros/CarForm'
import { useCarsStore } from '@store/carsStore'
import styles from './MeusCarros.module.css'

export const MeusCarros = () => {
  const navigate = useNavigate()
  const carros = useCarsStore((s) => s.carros)
  const addCar = useCarsStore((s) => s.addCar)
  const [adicionando, setAdicionando] = useState(false)

  const salvarNovo = async (payload) => {
    const novo = await addCar(payload)
    setAdicionando(false)
    navigate(`/carro/${novo.id}`)
  }

  return (
    <AppShell
      header={
        <Header
          left="menu"
          title="Meus carros"
          right="plus"
          onPlus={() => setAdicionando(true)}
        />
      }
    >
      <div className={styles.page}>
        <SectionLabel>seus veículos ({carros.length})</SectionLabel>

        <div className={styles.lista}>
          {carros.map((carro) => (
            <CarListCard
              key={carro.id}
              carro={carro}
              onClick={() => navigate(`/carro/${carro.id}`)}
            />
          ))}
        </div>

        <button className={styles.adicionar} onClick={() => setAdicionando(true)}>
          <Plus size={18} />
          Adicionar veículo
        </button>
      </div>

      <Modal
        aberto={adicionando}
        onFechar={() => setAdicionando(false)}
        titulo="Adicionar veículo"
      >
        <CarForm inicial={{ modelo: '', placa: '', ano: '', cor: '' }} onSalvar={salvarNovo} />
      </Modal>
    </AppShell>
  )
}
