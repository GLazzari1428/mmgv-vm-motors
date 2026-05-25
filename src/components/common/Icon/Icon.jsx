import { createElement } from 'react'
import { getIcon } from '@utils/icons'

// renderiza o icone do lucide a partir do nome do mock
export const Icon = ({ name, ...props }) => createElement(getIcon(name), props)
