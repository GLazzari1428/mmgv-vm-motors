import styles from './Card.module.css'

// card base, aceita barra colorida na esquerda via barColor
export const Card = ({
  children,
  barColor,
  onClick,
  className = '',
  as = 'div',
}) => {
  const Tag = as
  const classes = [styles.card, barColor ? styles.withBar : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      className={classes}
      onClick={onClick}
      data-bar={barColor || undefined}
    >
      {children}
    </Tag>
  )
}
