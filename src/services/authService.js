import { api } from './api'

// chamadas relacionadas a conta e autenticacao
export const authService = {
  async register(nome, email, senha) {
    const { data } = await api.post('/auth/register', { nome, email, senha })
    return data
  },

  async login(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha })
    return data
  },

  async me() {
    const { data } = await api.get('/auth/me')
    return data
  },

  async updatePerfil(nome, email) {
    const { data } = await api.put('/usuario', { nome, email })
    return data
  },

  async updateSenha(senhaAtual, novaSenha) {
    const { data } = await api.put('/usuario/senha', { senhaAtual, novaSenha })
    return data
  },

  async resetSenha(email, novaSenha) {
    const { data } = await api.post('/auth/reset-senha', { email, novaSenha })
    return data
  },
}
