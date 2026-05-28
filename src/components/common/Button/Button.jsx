import styles from './Button.module.css'

export const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  fullWidth = false,
}) => {
  const classes = [styles.button, styles[variant], fullWidth ? styles.full : '']
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
