import axios from 'axios'
import { config } from '@/config/environment'

// instancia unica do axios apontando pra API
export const api = axios.create({
  baseURL: config.apiUrl,
})

// le o token guardado pelo authStore (persist do zustand)
function getToken() {
  try {
    const raw = localStorage.getItem('mmgv-auth')
    if (!raw) return null
    return JSON.parse(raw)?.state?.token || null
  } catch {
    return null
  }
}

// injeta o token em toda requisicao
api.interceptors.request.use((req) => {
  const token = getToken()
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

// se o token expirar (401 com sessao ativa), limpa e manda pro login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status
    if (status === 401 && getToken()) {
      localStorage.removeItem('mmgv-auth')
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  }
)

// extrai a mensagem de erro da API pra mostrar na tela
export function getErro(error, fallback = 'algo deu errado, tente de novo') {
  return error?.response?.data?.erro || fallback
}
