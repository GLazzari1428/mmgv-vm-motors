import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Inicio } from '@pages/Inicio'
import { MeusCarros } from '@pages/MeusCarros'
import { CarProfile } from '@pages/CarProfile'
import { Manutencao } from '@pages/Manutencao'
import { Financeiro } from '@pages/Financeiro'
import { Perfil } from '@pages/Perfil'
import { Login } from '@pages/Login'
import { Cadastro } from '@pages/Cadastro'
import { RecuperarSenha } from '@pages/RecuperarSenha'
import { ProtectedRoute } from './ProtectedRoute'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* rotas publicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

        {/* rotas protegidas */}
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route
          path="/inicio"
          element={
            <ProtectedRoute>
              <Inicio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meus-carros"
          element={
            <ProtectedRoute>
              <MeusCarros />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carro/:id"
          element={
            <ProtectedRoute>
              <CarProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manutencao"
          element={
            <ProtectedRoute>
              <Manutencao />
            </ProtectedRoute>
          }
        />
        <Route
          path="/financeiro"
          element={
            <ProtectedRoute>
              <Financeiro />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
