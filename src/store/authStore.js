import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@services/authService'

// guarda o token e o usuario logado, persistidos no localStorage
export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,

      isAuth: () => !!get().token,

      login: async (email, senha) => {
        const { token, usuario } = await authService.login(email, senha)
        set({ token, usuario })
        return usuario
      },

      register: async (nome, email, senha) => {
        const { token, usuario } = await authService.register(nome, email, senha)
        set({ token, usuario })
        return usuario
      },

      logout: () => set({ token: null, usuario: null }),

      setUsuario: (usuario) => set({ usuario }),

      // revalida o usuario a partir do token (ex: ao reabrir o app)
      loadMe: async () => {
        const usuario = await authService.me()
        set({ usuario })
        return usuario
      },
    }),
    {
      name: 'mmgv-auth',
      partialize: (state) => ({ token: state.token, usuario: state.usuario }),
    }
  )
)
