import {
  Droplet,
  Car,
  Wind,
  Settings,
  SlidersHorizontal,
  Wrench,
  CheckCircle,
  XCircle,
  Info,
  Wallet,
} from 'lucide-react'

// mapeia os nomes de icone do mock pros componentes do lucide
export const iconMap = {
  droplet: Droplet,
  car: Car,
  wind: Wind,
  settings: Settings,
  'sliders-horizontal': SlidersHorizontal,
  wrench: Wrench,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  info: Info,
  wallet: Wallet,
}

export function getIcon(nome) {
  return iconMap[nome] || Info
}
