import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { AppShell } from '@components/layout/AppShell'
import { Header } from '@components/layout/Header'
import { SectionLabel } from '@components/common/SectionLabel'
import { CarListCard } from '@components/features/meusCarros/CarListCard'
import { useCarsStore } from '@store/carsStore'
import styles from './MeusCarros.module.css'

export const MeusCarros = () => {
  const navigate = useNavigate()
  const carros = useCarsStore((s) => s.carros)
  const selectCar = useCarsStore((s) => s.selectCar)

  const abrirCarro = (id) => {
    selectCar(id)
    navigate('/manutencao')
  }

  return (
    <AppShell
      header={
        <Header
          left="menu"
          title="Meus Carros"
          right="plus"
          onPlus={() => navigate('/adicionar-carro')}
        />
      }
    >
      <div className={styles.page}>
        <SectionLabel>seus veiculos ({carros.length})</SectionLabel>

        <div className={styles.lista}>
          {carros.map((carro) => (
            <CarListCard
              key={carro.id}
              carro={carro}
              onClick={() => abrirCarro(carro.id)}
            />
          ))}
        </div>

        <button
          className={styles.adicionar}
          onClick={() => navigate('/adicionar-carro')}
        >
          <Plus size={18} />
          Adicionar veiculo
        </button>
      </div>
    </AppShell>
  )
}
