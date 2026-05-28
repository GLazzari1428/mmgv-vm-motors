import { useNavigate } from 'react-router-dom'
import { Info, Wrench, SlidersHorizontal, Wallet } from 'lucide-react'
import { AppShell } from '@components/layout/AppShell'
import { Header } from '@components/layout/Header'
import { SectionLabel } from '@components/common/SectionLabel'
import { CarSelector } from '@components/features/inicio/CarSelector'
import { StatusBanner } from '@components/features/inicio/StatusBanner'
import { ItemMiniCard } from '@components/features/inicio/ItemMiniCard'
import { QuickAccessCard } from '@components/features/inicio/QuickAccessCard'
import { useCarsStore } from '@store/carsStore'
import styles from './Inicio.module.css'

export const Inicio = () => {
  const navigate = useNavigate()
  const carro = useCarsStore((s) => s.getSelectedCar())

  // mostra so os primeiros itens na grade de manutencao recente
  const recentes = carro.itens.slice(0, 4)

  const atalhos = [
    { label: 'Informacao', icon: Info, to: '/meus-carros' },
    { label: 'Manutencao', icon: Wrench, to: '/manutencao' },
    { label: 'Componentes', icon: SlidersHorizontal, to: '/manutencao' },
    { label: 'Financeiro', icon: Wallet, to: '/financeiro' },
  ]

  return (
    <AppShell header={<Header left="menu" right="avatar" />}>
      <div className={styles.page}>
        <CarSelector />
        <StatusBanner carro={carro} />

        <section>
          <SectionLabel>manutencao recente</SectionLabel>
          <div className={styles.grid}>
            {recentes.map((item) => (
              <ItemMiniCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>acesso rapido</SectionLabel>
          <div className={styles.grid}>
            {atalhos.map((a) => (
              <QuickAccessCard
                key={a.label}
                icon={a.icon}
                label={a.label}
                onClick={() => navigate(a.to)}
              />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
