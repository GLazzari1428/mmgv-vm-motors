import { api } from './api'

// itens de manutencao de um carro
export const maintenanceService = {
  async listItens(carroId) {
    const { data } = await api.get(`/carros/${carroId}/itens`)
    return data
  },

  async registrarItem(carroId, payload) {
    const { data } = await api.post(`/carros/${carroId}/itens`, payload)
    return data
  },

  async atualizarItem(itemId, payload) {
    const { data } = await api.put(`/itens/${itemId}`, payload)
    return data
  },

  async historico(itemId) {
    const { data } = await api.get(`/itens/${itemId}/historico`)
    return data
  },

  async tipos() {
    const { data } = await api.get('/tipos-item')
    return data
  },
}
