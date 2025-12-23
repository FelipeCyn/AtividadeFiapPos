import { Link } from 'react-router-dom'
import './Button.css'

function Button({
  children,
  to,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  ariaLabel,
  ariaDescribedBy
}) {
  const className = `btn btn-${variant}`

  if (to) {
    return (
      <Link
        to={to}
        className={className}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
