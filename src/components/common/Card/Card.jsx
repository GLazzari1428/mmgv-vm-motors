import styles from './Card.module.css'

export const Card = ({
  children,
  barColor,
  onClick,
  className = '',
  as = 'div',
}) => {
  const Tag = as
  const classes = [
    styles.card,
    barColor ? styles.withBar : '',
    onClick ? styles.clickable : '',
    className,
  ]
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
