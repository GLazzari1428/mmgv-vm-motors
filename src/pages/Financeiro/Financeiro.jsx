import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AppShell } from '@components/layout/AppShell'
import { Header } from '@components/layout/Header'
import { SectionLabel } from '@components/common/SectionLabel'
import { Button } from '@components/common/Button'
import { Modal } from '@components/common/Modal'
import { BarChart } from '@components/common/BarChart'
import { ResumoFinanceiro } from '@components/features/financeiro/ResumoFinanceiro'
import { CategoriaCard } from '@components/features/financeiro/CategoriaCard'
import { TransacaoRow } from '@components/features/financeiro/TransacaoRow'
import { useCarsStore } from '@store/carsStore'
import { financeService } from '@services/financeService'
import { getErro } from '@services/api'
import { formatMoeda } from '@utils/formatters'
import styles from './Financeiro.module.css'

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const ABREV = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const mesAtual = () => new Date().toISOString().slice(0, 7)
const nomeMes = (ym) => `${MESES[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`
const abrevMes = (ym) => ABREV[Number(ym.slice(5, 7)) - 1] || ym

export const Financeiro = () => {
  const carro = useCarsStore((s) => s.getSelectedCar())
  const carId = carro?.id

  const [mes, setMes] = useState(mesAtual())
  const [resumo, setResumo] = useState(null)
  const [addAberto, setAddAberto] = useState(false)
  const [grafico, setGrafico] = useState(null) // { titulo, dados }

  // form de nova transacao
  const [categoria, setCategoria] = useState('')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [dataTx, setDataTx] = useState(new Date().toISOString().slice(0, 10))
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const chave = `${carId}|${mes}`

  useEffect(() => {
    if (!carId) return
    let ativo = true
    financeService
      .resumo(carId, mes)
      .then((d) => ativo && setResumo({ key: `${carId}|${d.mes}`, data: d }))
      .catch(() => ativo && setResumo({ key: chave, data: null }))
    return () => {
      ativo = false
    }
  }, [carId, mes, chave])

  const carregando = !resumo || resumo.key !== chave
  const dados = resumo?.key === chave ? resumo.data : null

  // navega entre meses, sem passar do mes atual
  const mudarMes = (delta) => {
    const [y, m] = mes.split('-').map(Number)
    const d = new Date(y, m - 1 + delta, 1)
    const novo = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (novo > mesAtual()) return
    setMes(novo)
  }

  const abrirAdd = () => {
    setCategoria(dados?.categorias[0]?.id || '')
    setDescricao('')
    setValor('')
    setDataTx(new Date().toISOString().slice(0, 10))
    setErro('')
    setAddAberto(true)
  }

  const salvar = async (e) => {
    e.preventDefault()
    if (!categoria || !descricao.trim() || valor === '') return
    setErro('')
    setSalvando(true)
    try {
      const upd = await financeService.criarTransacao(carId, {
        categoria,
        descricao: descricao.trim(),
        data: dataTx,
        valor: Number(valor),
      })
      setMes(upd.mes)
      setResumo({ key: `${carId}|${upd.mes}`, data: upd })
      setAddAberto(false)
    } catch (err) {
      setErro(getErro(err, 'Não foi possível salvar a transação'))
    } finally {
      setSalvando(false)
    }
  }

  const excluirTransacao = async (id) => {
    if (!window.confirm('Excluir esta transação?')) return
    try {
      const upd = await financeService.removerTransacao(id)
      setResumo({ key: `${carId}|${upd.mes}`, data: upd })
      setMes(upd.mes)
    } catch {
      // mantem a lista atual se falhar
    }
  }

  // graficos de historico (modal, read-only)
  const abrirGraficoGastos = async () => {
    setGrafico({ titulo: 'Gastos por mês', dados: null })
    const h = await financeService.historico(carId)
    setGrafico({
      titulo: 'Gastos por mês',
      dados: h.map((x) => ({ label: abrevMes(x.mes), valor: x.total })),
    })
  }

  const abrirGraficoCategoria = async (cat) => {
    setGrafico({ titulo: cat.nome, dados: null })
    const h = await financeService.historico(carId, cat.id)
    setGrafico({
      titulo: cat.nome,
      dados: h.map((x) => ({ label: abrevMes(x.mes), valor: x.total })),
    })
  }

  const header = (
    <Header left="menu" title="Financeiro" right="plus" onPlus={abrirAdd} />
  )

  if (!carro) {
    return (
      <AppShell header={header}>
        <p className={styles.vazio}>Nenhum carro selecionado</p>
      </AppShell>
    )
  }

  const maxValor = dados ? Math.max(...dados.categorias.map((c) => c.valor), 0) : 0

  return (
    <AppShell header={header}>
      <div className={styles.page}>
        <div className={styles.seletorMes}>
          <button className={styles.seta} onClick={() => mudarMes(-1)} aria-label="Mês anterior">
            <ChevronLeft size={20} />
          </button>
          <span className={styles.mesLabel}>{nomeMes(mes)}</span>
          <button
            className={styles.seta}
            onClick={() => mudarMes(1)}
            aria-label="Próximo mês"
            disabled={mes >= mesAtual()}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {carregando || !dados ? (
          <p className={styles.vazio}>Carregando...</p>
        ) : (
          <>
            <div className={styles.clicavel} onClick={abrirGraficoGastos}>
              <ResumoFinanceiro totalMes={dados.totalMes} mesAnterior={dados.mesAnterior} />
            </div>

            <section>
              <SectionLabel>por categoria</SectionLabel>
              <div className={styles.grid}>
                {dados.categorias.map((cat) => (
                  <CategoriaCard
                    key={cat.id}
                    categoria={cat}
                    maxValor={maxValor}
                    onClick={() => abrirGraficoCategoria(cat)}
                  />
                ))}
              </div>
            </section>

            <section>
              <SectionLabel>transações recentes</SectionLabel>
              <div className={styles.transacoes}>
                {dados.transacoes.length === 0 && (
                  <p className={styles.vazio}>Nenhuma transação neste mês</p>
                )}
                {dados.transacoes.map((t) => (
                  <TransacaoRow
                    key={t.id}
                    transacao={t}
                    onDelete={() => excluirTransacao(t.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      <Modal aberto={addAberto} onFechar={() => setAddAberto(false)} titulo="Nova transação">
        <form className={styles.form} onSubmit={salvar}>
          <label className={styles.field}>
            <span>Categoria</span>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {(dados?.categorias || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Descrição</span>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="ex: Posto Ipiranga"
            />
          </label>

          <div className={styles.linha}>
            <label className={styles.field}>
              <span>Valor</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
              />
            </label>
            <label className={styles.field}>
              <span>Data</span>
              <input type="date" value={dataTx} onChange={(e) => setDataTx(e.target.value)} />
            </label>
          </div>

          {erro && <p className={styles.erroForm}>{erro}</p>}

          <Button type="submit" variant="primary" fullWidth disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar transação'}
          </Button>
        </form>
      </Modal>

      <Modal aberto={!!grafico} onFechar={() => setGrafico(null)} titulo={grafico?.titulo || ''}>
        <p className={styles.modalSub}>Últimos 6 meses</p>
        {grafico?.dados === null ? (
          <p className={styles.vazio}>Carregando...</p>
        ) : (
          <BarChart dados={grafico?.dados || []} formatar={formatMoeda} altura={220} />
        )}
      </Modal>
    </AppShell>
  )
}
