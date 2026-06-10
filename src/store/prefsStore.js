import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// preferencias simples do app, persistidas no localStorage
export const usePrefsStore = create(
  persist(
    (set) => ({
      notificacoes: true,
      toggleNotificacoes: () => set((s) => ({ notificacoes: !s.notificacoes })),
    }),
    { name: 'mmgv-prefs' }
  )
)
