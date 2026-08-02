import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from './LanguageContext'
import ConfirmDialog from '../components/ConfirmDialog'

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

      <ConfirmDialog
        open={showConfirm}
        title={tr.confirmTitle}
        confirmLabel={tr.confirmYes}
        cancelLabel={tr.confirmCancel}
        cancelIcon="bi-pencil-fill"
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
        variant="warning"
      >
        {tr.confirmBody}
      </ConfirmDialog>
    </NavigationGuardContext.Provider>
  )
}

export const useNavigationGuard = () => useContext(NavigationGuardContext)
