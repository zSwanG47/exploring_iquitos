const ICONS = {
  success: 'bi-check-circle-fill',
  error: 'bi-exclamation-triangle-fill',
  warning: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
}

export default function AppNotice({ variant = 'info', icon, children, className = '' }) {
  return (
    <div
      className={`app-notice app-notice--${variant}${className ? ` ${className}` : ''}`}
      role="alert"
    >
      <i className={`bi ${icon || ICONS[variant]} app-notice__icon`} aria-hidden="true" />
      <div className="app-notice__content">{children}</div>
    </div>
  )
}
