import { api } from './api'

// stub de assinatura: o backend so persiste o estado, nao integra gateway de pagamento
export const subscriptionService = {
  async get() {
    const { data } = await api.get('/assinatura')
    return data
  },

  async subscribe(ciclo) {
    const { data } = await api.post('/assinatura', { ciclo })
    return data
  },

  async cancel() {
    const { data } = await api.delete('/assinatura')
    return data
  },
}
