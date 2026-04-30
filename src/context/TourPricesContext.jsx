import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { tours as localTours } from '../data/toursData'

const TourPricesContext = createContext({})

export function TourPricesProvider({ children }) {
  // Inicializar con precios locales como fallback
  const [prices, setPrices] = useState(() => {
    const map = {}
    localTours.forEach((t) => { map[t.id] = t.price })
    return map
  })

  useEffect(() => {
    supabase
      .from('tours')
      .select('id, precio')
      .then(({ data }) => {
        if (!data) return
        setPrices((prev) => {
          const next = { ...prev }
          data.forEach((row) => { next[row.id] = row.precio })
          return next
        })
      })
  }, [])

  return (
    <TourPricesContext.Provider value={prices}>
      {children}
    </TourPricesContext.Provider>
  )
}

export function useTourPrices() {
  return useContext(TourPricesContext)
}
