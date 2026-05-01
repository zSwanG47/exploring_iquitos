import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from './LanguageContext'

const NavigationGuardContext = createContext()

export function NavigationGuardProvider({ children }) {
  const navigate = useNavigate()
  const { t } = useLang()
  const [dirty, setDirty] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingDest, setPendingDest] = useState(null)

  const safeNavigate = useCallback((dest) => {
    if (dirty) {
      setPendingDest(dest)
      setShowConfirm(true)
    } else {
      navigate(dest)
    }
  }, [dirty, navigate])

  const confirmLeave = useCallback(() => {
    setShowConfirm(false)
    setDirty(false)
    navigate(pendingDest)
  }, [pendingDest, navigate])

  const cancelLeave = useCallback(() => {
    setShowConfirm(false)
    setPendingDest(null)
  }, [])

  const tr = t.reservar

  return (
    <NavigationGuardContext.Provider value={{ dirty, setDirty, safeNavigate }}>
      {children}

      {showConfirm && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={cancelLeave}
          />
          <div className="modal fade show d-block" style={{ zIndex: 1050 }} role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-exclamation-triangle-fill text-warning me-2" />
                    {tr.confirmTitle}
                  </h5>
                </div>
                <div className="modal-body text-muted">{tr.confirmBody}</div>
                <div className="modal-footer border-0 pt-0 gap-2">
                  <button className="btn btn-success fw-semibold" onClick={cancelLeave}>
                    <i className="bi bi-pencil-fill me-2" />
                    {tr.confirmCancel}
                  </button>
                  <button className="btn btn-outline-danger" onClick={confirmLeave}>
                    {tr.confirmYes}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </NavigationGuardContext.Provider>
  )
}

export const useNavigationGuard = () => useContext(NavigationGuardContext)
