import { api } from './api'

// resumo e lancamentos financeiros de um carro
export const financeService = {
  async resumo(carroId, mes) {
    const { data } = await api.get(`/carros/${carroId}/financeiro`, {
      params: mes ? { mes } : undefined,
    })
    return data
  },

  async historico(carroId, categoria) {
    const { data } = await api.get(`/carros/${carroId}/financeiro/historico`, {
      params: categoria ? { categoria } : undefined,
    })
    return data
  },

  async criarTransacao(carroId, payload) {
    const { data } = await api.post(`/carros/${carroId}/transacoes`, payload)
    return data
  },

  async categorias() {
    const { data } = await api.get('/categorias')
    return data
  },

  async removerTransacao(id) {
    const { data } = await api.delete(`/transacoes/${id}`)
    return data
  },
}
