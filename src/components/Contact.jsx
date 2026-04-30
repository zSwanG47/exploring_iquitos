import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useLang } from '../context/LanguageContext'

const initialForm = { nombre: '', email: '', telefono: '', mensaje: '' }

function sanitize(str) {
  if (typeof str !== 'string') return ''
  return str.replace(/[<>]/g, '').replace(/javascript:/gi, '').trim().slice(0, 2000)
}

export default function Contact() {
  const { t } = useLang()
  const tc = t.contact
  const [form, setForm] = useState(initialForm)
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState(null)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Si el campo honeypot tiene valor, es un bot — simular éxito silenciosamente
    if (honeypot) { setStatus('success'); setForm(initialForm); return }
    setStatus('loading')
    const sanitized = {
      nombre:   sanitize(form.nombre),
      email:    sanitize(form.email),
      telefono: sanitize(form.telefono),
      mensaje:  sanitize(form.mensaje),
    }
    try {
      const { error: dbError } = await supabase.from('contactos').insert([sanitized])
      if (dbError) throw dbError
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...sanitized, _hp: honeypot }),
        })
      } catch {
        // No bloquear si la función no está disponible en local
      }
      setStatus('success')
      setForm(initialForm)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contacto" className="contact-section">
      <div className="container">
        {/* Título */}
        <div className="text-center mb-5">
          <h2 className="section-title">{tc.sectionTitle}</h2>
          <div className="section-divider" />
          <p className="text-muted fs-5 mt-4">
            {tc.subtitle}
          </p>
        </div>

        <div className="row g-5 align-items-start">
          {/* Info de contacto */}
          <div className="col-lg-5">
            <h4 className="fw-bold mb-4" style={{ color: 'var(--green-primary)' }}>
              {tc.infoTitle}
            </h4>

            {[
              { icon: 'bi-geo-alt-fill',  label: tc.labelLocation, value: 'Iquitos, Loreto, Peru' },
              { icon: 'bi-whatsapp',      label: tc.labelWhatsApp, value: '+51 931 483 071' },
              { icon: 'bi-envelope-fill', label: tc.labelEmail,    value: 'exploringiquitos@gmail.com' },
              { icon: 'bi-clock-fill',    label: tc.labelSchedule, value: tc.scheduleValue },
            ].map(({ icon, label, value }) => (
              <div className="d-flex align-items-start mb-4" key={label}>
                <i
                  className={`bi ${icon} fs-4 me-3 flex-shrink-0`}
                  style={{ color: 'var(--green-primary)' }}
                />
                <div>
                  <strong>{label}</strong>
                  <p className="text-muted mb-0">{value}</p>
                </div>
              </div>
            ))}

            {/* Imagen decorativa */}
            <img
              src="/images/foto23.jpeg"
              alt="Iquitos"
              className="img-fluid rounded-3 shadow mt-2"
              style={{ maxHeight: '220px', objectFit: 'cover', width: '100%' }}
              loading="lazy"
            />
          </div>

          {/* Formulario */}
          <div className="col-lg-7">
            <div className="bg-white p-4 p-lg-5 rounded-4 shadow-sm">
              {status === 'success' && (
                <div className="alert alert-success d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill fs-5" />
                  <span>
                    {tc.successMsg}
                  </span>
                </div>
              )}
              {status === 'error' && (
                <div className="alert alert-danger d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-circle-fill fs-5" />
                  <span>{tc.errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot anti-bot: invisible para humanos, los bots lo llenan */}
                <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
                  <input
                    type="text"
                    name="_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">{tc.name}</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      placeholder={tc.namePlaceholder}
                      value={form.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">{tc.email}</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder={tc.emailPlaceholder}
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      {tc.phone}{' '}
                      <span className="text-muted fw-normal">{tc.phoneOptional}</span>
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      className="form-control"
                      placeholder={tc.phonePlaceholder}
                      value={form.telefono}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">{tc.message}</label>
                    <textarea
                      name="mensaje"
                      className="form-control"
                      rows={5}
                      placeholder={tc.messagePlaceholder}
                      value={form.mensaje}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          {tc.sending}
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2" />
                          {tc.send}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
