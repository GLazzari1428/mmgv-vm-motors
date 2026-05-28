import { AppShell } from '@components/layout/AppShell'
import { Header } from '@components/layout/Header'
import { SectionLabel } from '@components/common/SectionLabel'
import { ResumoFinanceiro } from '@components/features/financeiro/ResumoFinanceiro'
import { CategoriaCard } from '@components/features/financeiro/CategoriaCard'
import { TransacaoRow } from '@components/features/financeiro/TransacaoRow'
import { useCarsStore } from '@store/carsStore'
import { financeiroMock } from '@utils/mockData'
import styles from './Financeiro.module.css'

export const Financeiro = () => {
  const carro = useCarsStore((s) => s.getSelectedCar())
  const dados = financeiroMock[carro.id] || financeiroMock.uno

  const maxValor = Math.max(...dados.categorias.map((c) => c.valor))

  return (
    <AppShell header={<Header left="menu" title="Financeiro" right="avatar" />}>
      <div className={styles.page}>
        <ResumoFinanceiro totalMes={dados.totalMes} mesAnterior={dados.mesAnterior} />

        <section>
          <SectionLabel>por categoria</SectionLabel>
          <div className={styles.grid}>
            {dados.categorias.map((cat) => (
              <CategoriaCard key={cat.id} categoria={cat} maxValor={maxValor} />
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>transacoes recentes</SectionLabel>
          <div className={styles.transacoes}>
            {dados.transacoes.map((t) => (
              <TransacaoRow key={t.id} transacao={t} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
