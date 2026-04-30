import nodemailer from 'nodemailer'
import { checkRateLimit } from './_rateLimit.js'

// Elimina tags HTML y caracteres peligrosos
function sanitize(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/[<>]/g, '')           // strip < >
    .replace(/javascript:/gi, '')   // strip js protocol
    .replace(/on\w+=/gi, '')        // strip onerror= onclick= etc
    .trim()
    .slice(0, 2000)                 // limitar longitud máxima
}

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || ''

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────
  const origin = req.headers.origin || ''
  if (ALLOWED_ORIGIN && origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(204).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // ── Rate limiting: 15 req/min por IP ─────────────────────────
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'

  const { allowed, remaining } = checkRateLimit(ip)
  res.setHeader('X-RateLimit-Remaining', remaining)

  if (!allowed) {
    return res.status(429).json({ error: 'Demasiadas peticiones. Intenta en un minuto.' })
  }

  // ── Honeypot anti-bot: campo oculto debe estar vacío ─────────
  if (req.body._hp) {
    // Bot detectado — responder 200 para no dar pistas
    return res.status(200).json({ ok: true })
  }

  // ── Validar User-Agent (bloquear bots obvios) ─────────────────
  const ua = req.headers['user-agent'] || ''
  if (!ua || /curl|wget|python-requests|scrapy|libwww/i.test(ua)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  // ── Sanitizar inputs ─────────────────────────────────────────
  const nombre  = sanitize(req.body?.nombre)
  const email   = sanitize(req.body?.email)
  const telefono = sanitize(req.body?.telefono)
  const mensaje = sanitize(req.body?.mensaje)

  // ── Validar campos requeridos ─────────────────────────────────
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos requeridos' })
  }

  // Validar formato email básico
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' })
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1d7a3d; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #fff; margin: 0;">📩 Nueva consulta — Exploring Iquitos</h2>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555; width: 140px;">Nombre</td>
            <td style="padding: 8px 0; color: #222;">${nombre}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Correo</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #1d7a3d;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Teléfono</td>
            <td style="padding: 8px 0; color: #222;">${telefono || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Mensaje</td>
            <td style="padding: 8px 0; color: #222; white-space: pre-line;">${mensaje}</td>
          </tr>
        </table>
      </div>
      <p style="color: #aaa; font-size: 12px; text-align: center; margin-top: 16px;">
        Exploring Iquitos · exploringiquitos@gmail.com
      </p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"Exploring Iquitos Web" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `Nueva consulta de ${nombre}`,
      html,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Error enviando correo:', err)
    return res.status(500).json({ error: 'Error al enviar el correo' })
  }
}

