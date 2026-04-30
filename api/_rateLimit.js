// Rate limiter en memoria — 15 peticiones por IP por ventana de 1 minuto
const ipMap = new Map()
const MAX_REQUESTS = 15
const WINDOW_MS = 60 * 1000 // 1 minuto

export function checkRateLimit(ip) {
  const now = Date.now()
  const entry = ipMap.get(ip) || { count: 0, resetAt: now + WINDOW_MS }

  if (now > entry.resetAt) {
    entry.count = 1
    entry.resetAt = now + WINDOW_MS
  } else {
    entry.count++
  }

  ipMap.set(ip, entry)

  // Limpiar IPs antiguas si el mapa crece mucho
  if (ipMap.size > 2000) {
    for (const [key, val] of ipMap.entries()) {
      if (now > val.resetAt) ipMap.delete(key)
    }
  }

  return {
    allowed: entry.count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
    resetAt: entry.resetAt,
  }
}
