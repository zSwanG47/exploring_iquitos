import { applyCors, enforceRateLimit, rejectBots, sanitize } from './_http.js'
import { captureAndVerifyOrder } from './_paypal.js'
import { getSupabaseAdmin } from './_supabaseAdmin.js'

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

  const refToken = sanitize(req.body?.ref_token)
  const orderId = sanitize(req.body?.orderID)

  if (!refToken || !orderId) {
    return res.status(400).json({ error: 'Datos de pago incompletos' })
  }

  try {
    const supabase = getSupabaseAdmin()

    const { data: reserva, error: fetchError } = await supabase
      .from('reservas')
      .select('id, estado, total_usd, paypal_order_id')
      .eq('ref_token', refToken)
      .maybeSingle()

    if (fetchError) throw fetchError
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }

    if (reserva.estado === 'pagado') {
      return res.status(200).json({ ok: true, alreadyPaid: true })
    }

    if (reserva.estado !== 'pendiente') {
      return res.status(409).json({ error: 'La reserva no puede pagarse' })
    }

    if (reserva.paypal_order_id && reserva.paypal_order_id !== orderId) {
      return res.status(409).json({ error: 'Orden de pago no coincide' })
    }

    const verified = await captureAndVerifyOrder(orderId, reserva.total_usd)

    const { error: updateError } = await supabase
      .from('reservas')
      .update({
        estado: 'pagado',
        paypal_order_id: verified.orderId,
      })
      .eq('ref_token', refToken)
      .eq('estado', 'pendiente')

    if (updateError) throw updateError

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Error confirmando pago:', err)
    return res.status(400).json({ error: 'No se pudo confirmar el pago' })
  }
}
