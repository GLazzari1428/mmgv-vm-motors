import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { useCarsStore } from '@store/carsStore'

// libera a rota so com token; ao entrar, carrega os carros uma vez
export const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token)
  const loaded = useCarsStore((s) => s.loaded)
  const loading = useCarsStore((s) => s.loading)
  const fetchCars = useCarsStore((s) => s.fetchCars)

  useEffect(() => {
    if (token && !loaded && !loading) {
      fetchCars().catch(() => {})
    }
  }, [token, loaded, loading, fetchCars])

  if (!token) return <Navigate to="/login" replace />
  return children
}
