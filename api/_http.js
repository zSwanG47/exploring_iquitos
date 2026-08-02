import { checkRateLimit } from './_rateLimit.js'

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || ''

export function sanitize(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 2000)
}

export function applyCors(req, res) {
  const origin = req.headers.origin || ''
  if (ALLOWED_ORIGIN && origin !== ALLOWED_ORIGIN) {
    return false
  }
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  return true
}

export function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  )
}

export function enforceRateLimit(req, res, maxRequests = 15) {
  const ip = getClientIp(req)
  const { allowed, remaining } = checkRateLimit(ip, maxRequests)
  res.setHeader('X-RateLimit-Remaining', remaining)
  return allowed
}

export function rejectBots(req, res) {
  const ua = req.headers['user-agent'] || ''
  if (!ua || /curl|wget|python-requests|scrapy|libwww/i.test(ua)) {
    res.status(403).json({ error: 'Forbidden' })
    return true
  }
  return false
}
