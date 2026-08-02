import { tours, getTourById } from '../src/data/toursData.js'
import { sanitize } from './_http.js'
import { getSupabaseAdmin } from './_supabaseAdmin.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function getLimaDateString(date = new Date()) {
  return date.toLocaleDateString('en-CA', { timeZone: 'America/Lima' })
}

function getMinBookingDateStr() {
  const [y, m, d] = getLimaDateString().split('-').map(Number)
  const min = new Date(y, m - 1, d + 1)
  return [
    min.getFullYear(),
    String(min.getMonth() + 1).padStart(2, '0'),
    String(min.getDate()).padStart(2, '0'),
  ].join('-')
}

export async function resolveTourPrice(tourId) {
  if (!getTourById(tourId)) return null

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('tours')
    .select('precio')
    .eq('id', tourId)
    .maybeSingle()

  if (error || data?.precio == null) return null
  const price = Number(data.precio)
  return Number.isFinite(price) && price > 0 ? price : null
}

export function validateReservaPayload(body) {
  const tourId = sanitize(body?.tour_id)
  const tour = getTourById(tourId)
  if (!tour) {
    return { error: 'Tour no válido' }
  }

  const nombres = sanitize(body?.nombres)
  const apellidos = sanitize(body?.apellidos)
  const telefono = sanitize(body?.telefono)
  const documento = sanitize(body?.documento)
  const correo = sanitize(body?.correo).toLowerCase()
  const descripcion = sanitize(body?.descripcion)
  const fechaTour = sanitize(body?.fecha)
  const personas = Number(body?.personas)

  if (!nombres || !apellidos || !telefono || !documento || !correo || !fechaTour) {
    return { error: 'Faltan campos requeridos' }
  }

  if (!EMAIL_RE.test(correo)) {
    return { error: 'Correo inválido' }
  }

  if (!Number.isInteger(personas) || personas < 1 || personas > 20) {
    return { error: 'Número de personas inválido' }
  }

  if (!DATE_RE.test(fechaTour)) {
    return { error: 'Fecha inválida' }
  }

  const minDate = getMinBookingDateStr()
  if (fechaTour < minDate) {
    return { error: 'La fecha debe ser al menos mañana' }
  }

  return {
    data: {
      tour_id: tourId,
      tour_nombre: tour.name,
      nombres,
      apellidos,
      telefono,
      documento,
      correo,
      personas,
      fecha_tour: fechaTour,
      descripcion,
    },
  }
}

export function getKnownTourIds() {
  return tours.map((t) => t.id)
}
