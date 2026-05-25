import { useEffect } from 'react'
import { useThemeStore } from '@store/themeStore'

// aplica o data-theme no html sempre que o tema muda
export function useTheme() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return { theme, toggleTheme }
}
