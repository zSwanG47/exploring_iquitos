import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const TourPricesContext = createContext({ prices: {}, loading: true })

export function TourPricesProvider({ children }) {
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('tours')
      .select('id, precio')
      .then(({ data }) => {
        if (data) {
          const map = {}
          data.forEach((row) => {
            if (row.precio != null) map[row.id] = Number(row.precio)
          })
          setPrices(map)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <TourPricesContext.Provider value={{ prices, loading }}>
      {children}
    </TourPricesContext.Provider>
  )
}

export function useTourPrices() {
  return useContext(TourPricesContext)
}

export function useTourPrice(tourId) {
  const { prices, loading } = useTourPrices()
  return { price: prices[tourId] ?? null, loading }
}
