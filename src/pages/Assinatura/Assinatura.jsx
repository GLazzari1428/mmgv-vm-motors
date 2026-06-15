import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ShieldCheck,
  CloudCog,
  ScanLine,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react'
import { AppShell } from '@components/layout/AppShell'
import { Header } from '@components/layout/Header'
import { SectionLabel } from '@components/common/SectionLabel'
import { Card } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { useAuthStore } from '@store/authStore'
import { subscriptionService } from '@services/subscriptionService'
import { getErro } from '@services/api'
import styles from './Assinatura.module.css'

// valores ficticios 
const PRECOS = {
  mensal: { preco: 'R$ 7,90', sufixo: '/mês' },
  anual: { preco: 'R$ 75,00', sufixo: '/ano', economia: 'economize ~21%' },
}

const BENEFICIOS = [
  {
    icone: ShieldCheck,
    titulo: 'Backup criptografado de ponta a ponta',
    sub: 'Seus dados saem criptografados do seu celular. Nem nós conseguimos ler.',
    destaque: true,
  },
  {
    icone: CloudCog,
    titulo: 'Sincronização entre dispositivos',
    sub: 'Use no celular, no tablet e no computador, sempre atualizado.',
  },
  {
    icone: ScanLine,
    titulo: 'Buscar dados do carro pela placa',
    sub: 'Digite a placa e nós preenchemos modelo, ano e cor pra você.',
    pill: 'em breve',
  },
  {
    icone: HeartHandshake,
    titulo: 'Apoie o desenvolvimento',
    sub: 'A mensalidade cobre o custo dos servidores e mantém o app vivo.',
  },
]

function formatarData(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR')
  } catch {
    return ''
  }
}

export const Assinatura = () => {
  const navigate = useNavigate()
  const usuario = useAuthStore((s) => s.usuario)
  const setUsuario = useAuthStore((s) => s.setUsuario)
  const loadMe = useAuthStore((s) => s.loadMe)

  const ehPremium = usuario?.plano === 'premium'

  const [ciclo, setCiclo] = useState(usuario?.plano_ciclo || 'mensal')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  const assinar = async () => {
    setErro('')
    setEnviando(true)
    try {
      await subscriptionService.subscribe(ciclo)
      const atualizado = await loadMe()
      setUsuario(atualizado)
      navigate('/perfil')
    } catch (err) {
      setErro(getErro(err, 'Não foi possível concluir a assinatura'))
      setEnviando(false)
    }
  }

  const cancelar = async () => {
    if (!window.confirm('Cancelar sua assinatura Premium agora?')) return
    setErro('')
    setEnviando(true)
    try {
      await subscriptionService.cancel()
      const atualizado = await loadMe()
      setUsuario(atualizado)
    } catch (err) {
      setErro(getErro(err, 'Não foi possível cancelar agora'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AppShell header={<Header left="back" title="Premium" right="avatar" />}>
      <div className={styles.page}>
        <Card className={styles.hero}>
          <span className={styles.heroIcon}>
            <Sparkles size={28} />
          </span>
          <p className={styles.heroTitulo}>VM Motors Premium</p>
          <p className={styles.heroSub}>
            Tenha seus carros salvos na nuvem com segurança, em qualquer dispositivo.
          </p>
        </Card>

        <section>
          <SectionLabel>o que vem junto</SectionLabel>
          <Card className={styles.beneficios}>
            {BENEFICIOS.map((b, i) => {
              const Icone = b.icone
              return (
                <div
                  key={b.titulo}
                  className={`${styles.beneficio} ${b.destaque ? styles.destaque : ''}`}
                >
                  <span className={styles.benIcon}>
                    <Icone size={20} />
                  </span>
                  <div className={styles.benTexto}>
                    <div className={styles.benTitleLinha}>
                      <p className={styles.benTitulo}>{b.titulo}</p>
                      {b.pill && <span className={styles.pill}>{b.pill}</span>}
                    </div>
                    <p className={styles.benSub}>{b.sub}</p>
                  </div>
                  {i < BENEFICIOS.length - 1 && <div className={styles.divider} />}
                </div>
              )
            })}
          </Card>
        </section>

        {ehPremium ? (
          <section>
            <SectionLabel>seu plano</SectionLabel>
            <Card className={styles.statusCard}>
              <div className={styles.statusLinha}>
                <CheckCircle2 size={20} className={styles.statusIcone} />
                <div>
                  <p className={styles.statusTitulo}>Premium ativo</p>
                  <p className={styles.statusSub}>
                    Plano {usuario?.plano_ciclo === 'anual' ? 'anual' : 'mensal'}, renova em{' '}
                    {formatarData(usuario?.plano_fim)}
                  </p>
                </div>
              </div>
              {erro && <p className={styles.erro}>{erro}</p>}
              <Button variant="danger" fullWidth onClick={cancelar} disabled={enviando}>
                {enviando ? 'Cancelando...' : 'Cancelar assinatura'}
              </Button>
            </Card>
          </section>
        ) : (
          <>
            <section>
              <SectionLabel>escolha o ciclo</SectionLabel>
              <div className={styles.ciclos}>
                <button
                  type="button"
                  className={`${styles.cicloCard} ${ciclo === 'mensal' ? styles.cicloAtivo : ''}`}
                  onClick={() => setCiclo('mensal')}
                >
                  <p className={styles.cicloNome}>Mensal</p>
                  <p className={styles.cicloPreco}>{PRECOS.mensal.preco}</p>
                  <p className={styles.cicloSufixo}>{PRECOS.mensal.sufixo}</p>
                </button>

                <button
                  type="button"
                  className={`${styles.cicloCard} ${ciclo === 'anual' ? styles.cicloAtivo : ''}`}
                  onClick={() => setCiclo('anual')}
                >
                  <span className={styles.pillEcon}>{PRECOS.anual.economia}</span>
                  <p className={styles.cicloNome}>Anual</p>
                  <p className={styles.cicloPreco}>{PRECOS.anual.preco}</p>
                  <p className={styles.cicloSufixo}>{PRECOS.anual.sufixo}</p>
                </button>
              </div>
            </section>

            {erro && <p className={styles.erro}>{erro}</p>}

            <Button variant="primary" fullWidth onClick={assinar} disabled={enviando}>
              {enviando ? 'Processando...' : 'Assinar Premium'}
            </Button>
          </>
        )}

        <p className={styles.rodape}>
          Você pode usar o VM Motors de graça pra sempre. O Premium existe pra cobrir o custo dos
          servidores e manter o app vivo.
        </p>
      </div>
    </AppShell>
  )
}
