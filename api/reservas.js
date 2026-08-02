import { randomUUID } from 'crypto'
import { applyCors, enforceRateLimit, rejectBots } from './_http.js'
import { getSupabaseAdmin } from './_supabaseAdmin.js'
import { resolveTourPrice, validateReservaPayload } from './_reservaValidation.js'

export default async function handler(req, res) {
  if (!applyCors(req, res)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  if (req.method === 'OPTIONS') return res.status(204).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!enforceRateLimit(req, res, 10)) {
    return res.status(429).json({ error: 'Demasiadas peticiones. Intenta en un minuto.' })
  }

  if (rejectBots(req, res)) return

  const validation = validateReservaPayload(req.body)
  if (validation.error) {
    return res.status(400).json({ error: validation.error })
  }

  const price = await resolveTourPrice(validation.data.tour_id)
  if (price == null || price <= 0) {
    return res.status(400).json({ error: 'Tour no disponible' })
  }

  const totalUsd = Number((price * validation.data.personas).toFixed(2))
  const refToken = randomUUID()

  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('reservas').insert([
      {
        ...validation.data,
        total_usd: totalUsd,
        estado: 'pendiente',
        ref_token: refToken,
      },
    ])

    if (error) throw error

    return res.status(201).json({
      ref_token: refToken,
      total_usd: totalUsd,
      unit_price: price,
    })
  } catch (err) {
    console.error('Error creando reserva:', err)
    return res.status(500).json({ error: 'No se pudo crear la reserva' })
  }
}
