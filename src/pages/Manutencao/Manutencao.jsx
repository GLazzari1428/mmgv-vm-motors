import { Plus } from 'lucide-react'
import { AppShell } from '@components/layout/AppShell'
import { Header } from '@components/layout/Header'
import { SectionLabel } from '@components/common/SectionLabel'
import { Button } from '@components/common/Button'
import { ResumoCard } from '@components/features/manutencao/ResumoCard'
import { ItemRow } from '@components/features/manutencao/ItemRow'
import { useCarsStore } from '@store/carsStore'
import styles from './Manutencao.module.css'

export const Manutencao = () => {
  const carro = useCarsStore((s) => s.getSelectedCar())

  return (
    <AppShell header={<Header left="back" title="Manutencao" right="avatar" />}>
      <div className={styles.page}>
        <p className={styles.subtitulo}>
          {carro.modelo} - {carro.placa}
        </p>

        <ResumoCard itens={carro.itens} />

        <section>
          <SectionLabel>todos os itens</SectionLabel>
          <div className={styles.lista}>
            {carro.itens.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>

        <div className={styles.acoes}>
          <Button variant="primary" fullWidth onClick={() => console.log('registrar manutencao')}>
            <Plus size={18} />
            Registrar nova manutencao
          </Button>
          <Button variant="danger" fullWidth onClick={() => console.log('registrar problema')}>
            Registrar problema
          </Button>
        </div>
      </div>
    </AppShell>
  )
}
