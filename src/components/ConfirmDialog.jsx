const ICONS = {
  warning: 'bi-exclamation-triangle-fill',
  danger: 'bi-exclamation-octagon-fill',
}

export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = 'warning',
  cancelIcon,
}) {
  if (!open) return null

  return (
    <>
      <div className="app-confirm__backdrop" onClick={onCancel} aria-hidden="true" />
      <div className="app-confirm" role="dialog" aria-modal="true" aria-labelledby="app-confirm-title">
        <div className="app-confirm__dialog">
          <div className={`app-confirm__icon app-confirm__icon--${variant}`}>
            <i className={`bi ${ICONS[variant] || ICONS.warning}`} aria-hidden="true" />
          </div>
          <h2 className="app-confirm__title" id="app-confirm-title">{title}</h2>
          <p className="app-confirm__body">{children}</p>
          <div className="app-confirm__actions">
            <button
              type="button"
              className="app-confirm__btn app-confirm__btn--ghost"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
            <button
              type="button"
              className="app-confirm__btn app-confirm__btn--primary"
              onClick={onCancel}
            >
              {cancelIcon && <i className={`bi ${cancelIcon}`} aria-hidden="true" />}
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
