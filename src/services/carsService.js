import { api } from './api'

// CRUD de carros
export const carsService = {
  async list() {
    const { data } = await api.get('/carros')
    return data
  },

  async get(id) {
    const { data } = await api.get(`/carros/${id}`)
    return data
  },

  async create(payload) {
    const { data } = await api.post('/carros', payload)
    return data
  },

  async update(id, payload) {
    const { data } = await api.put(`/carros/${id}`, payload)
    return data
  },

  async remove(id) {
    const { data } = await api.delete(`/carros/${id}`)
    return data
  },
}
