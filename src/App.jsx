import { useTheme } from '@hooks/useTheme'
import { AppRoutes } from '@routes/AppRoutes'

function App() {
  // aplica o tema salvo no html
  useTheme()

  return <AppRoutes />
}

export default App
