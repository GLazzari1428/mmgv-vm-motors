import styles from './Button.module.css'

export const Button = ({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
