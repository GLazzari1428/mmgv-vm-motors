import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Inicio } from '@pages/Inicio'
import { MeusCarros } from '@pages/MeusCarros'
import { Manutencao } from '@pages/Manutencao'
import { Financeiro } from '@pages/Financeiro'
import { Perfil } from '@pages/Perfil'
import { Login } from '@pages/Login'
import { Cadastro } from '@pages/Cadastro'
import { AdicionarCarro } from '@pages/AdicionarCarro'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/meus-carros" element={<MeusCarros />} />
        <Route path="/manutencao" element={<Manutencao />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/adicionar-carro" element={<AdicionarCarro />} />
        <Route path="*" element={<Navigate to="/inicio" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
