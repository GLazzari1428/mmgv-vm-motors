import { createElement } from 'react'
import { getIcon } from '@utils/icons'

export const Icon = ({ name, ...props }) => createElement(getIcon(name), props)
