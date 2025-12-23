import './Input.css'

function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  id,
  name,
  ariaLabel,
  ariaDescribedBy
}) {
  const inputId = id || name || label?.toLowerCase().replace(/\s/g, '-') || 'input'
  const errorId = `${inputId}-error`

  return (
    <div className="input-group" role="group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true">*</span>}
        </label>
      )}

      <input
        type={type}
        id={inputId}
        name={name}
        className={`input ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-label={ariaLabel || label || placeholder}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : ariaDescribedBy}
      />

      {error && (
        <span
          id={errorId}
          className="input-error-message"
          role="alert"
          aria-live="polite"
        >
          {error}
        </span>
      )}
    </div>
  )
}

export default Input
