import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { getTourById, getLocalizedTour } from '../data/toursData'
import { supabase } from '../supabaseClient'
import { useLang } from '../context/LanguageContext'
import { useTourPrices } from '../context/TourPricesContext'

export default function Reservar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const tr = t.reservar
  const prices = useTourPrices()
  const tour = getLocalizedTour(getTourById(id), lang)

  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    documento: '',
    correo: '',
    personas: 1,
    fecha: '',
    descripcion: '',
  })

  // Mínimo: mañana en hora local (se puede reservar hoy para mañana)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDateStr = [
    tomorrow.getFullYear(),
    String(tomorrow.getMonth() + 1).padStart(2, '0'),
    String(tomorrow.getDate()).padStart(2, '0'),
  ].join('-')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('form') // 'form' | 'payment' | 'success'
  const [reservaToken, setReservaToken] = useState(null)
  const [error, setError] = useState('')
  const [payError, setPayError] = useState('')
  const [dirty, setDirty] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingDest, setPendingDest] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Warn on browser back / tab close
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  if (!tour) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <h2>{tr.notFound}</h2>
        <button className="btn btn-success mt-3" onClick={() => navigate('/')}>
          {tr.backHome}
        </button>
      </div>
    )
  }

  const price = tour ? (prices[tour.id] ?? tour.price) : 0
  const total = price * Number(form.personas)

  const handleChange = (e) => {
    const { name, value } = e.target
    setDirty(true)
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const safeNavigate = useCallback((dest) => {
    if (dirty && step === 'form') {
      setPendingDest(dest)
      setShowConfirm(true)
    } else {
      navigate(dest)
    }
  }, [dirty, step, navigate])

  const confirmLeave = () => {
    setShowConfirm(false)
    navigate(pendingDest)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const refToken = crypto.randomUUID()
      const { error: dbError } = await supabase.from('reservas').insert([
        {
          tour_id: tour.id,
          tour_nombre: tour.name,
          nombres: form.nombres,
          apellidos: form.apellidos,
          telefono: form.telefono,
          documento: form.documento,
          correo: form.correo,
          personas: Number(form.personas),
          fecha_tour: form.fecha,
          descripcion: form.descripcion,
          total_usd: total,
          estado: 'pendiente',
          ref_token: refToken,
        },
      ])
      if (dbError) throw dbError
      setReservaToken(refToken)
      setStep('payment')
      window.scrollTo(0, 0)
    } catch {
      setError(tr.errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div
        className="container py-5 text-center"
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }} />
        <h2 className="fw-bold mt-4 mb-2">{tr.successTitle}</h2>
        <p className="text-muted mb-1 fs-5">
          {tr.successMsg(form.nombres)}
        </p>
        <p className="text-muted mb-4">
          {tr.successSub}
        </p>
        <button className="btn btn-success px-5 py-2 fw-semibold" onClick={() => navigate('/')}>
          {tr.backHome}
        </button>
      </div>
    )
  }

  if (step === 'payment') {
    return (
      <div className="container py-5 mt-5" style={{ minHeight: '70vh' }}>
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card border-0 shadow-sm p-4">
              <h4 className="fw-bold mb-1" style={{ color: 'var(--green-primary)' }}>
                <i className="bi bi-paypal me-2" />
                {tr.payTitle}
              </h4>
              <p className="text-muted small mb-4">{tr.paySubtitle}</p>

              <div className="d-flex justify-content-between align-items-center bg-light rounded p-3 mb-4">
                <span className="fw-semibold text-muted">{tr.payAmount}</span>
                <span className="fw-bold fs-4" style={{ color: 'var(--green-primary)' }}>
                  ${total.toFixed(2)}{' '}
                  <span className="fs-6 fw-normal text-muted">USD</span>
                </span>
              </div>

              {payError && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
                  {payError}
                </div>
              )}

              <PayPalButtons
                style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
                createOrder={(data, actions) =>
                  actions.order.create({
                    purchase_units: [{
                      amount: { value: total.toFixed(2) },
                      description: `${tour.name} × ${form.personas} persona(s)`,
                    }],
                  })
                }
                onApprove={async (data, actions) => {
                  await actions.order.capture()
                  await supabase.from('reservas').update({
                    estado: 'pagado',
                    paypal_order_id: data.orderID,
                  }).eq('ref_token', reservaToken)
                  setStep('success')
                  window.scrollTo(0, 0)
                }}
                onError={() => setPayError(tr.payError)}
              />

              <button
                className="btn btn-link text-muted mt-2 text-decoration-none ps-0"
                onClick={() => setStep('form')}
              >
                <i className="bi bi-arrow-left me-1" />
                {tr.payCancel}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Confirm leave modal ── */}
      {showConfirm && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={() => setShowConfirm(false)}
          />
          <div
            className="modal fade show d-block"
            style={{ zIndex: 1050 }}
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-exclamation-triangle-fill text-warning me-2" />
                    {tr.confirmTitle}
                  </h5>
                </div>
                <div className="modal-body text-muted">
                  {tr.confirmBody}
                </div>
                <div className="modal-footer border-0 pt-0 gap-2">
                  <button
                    className="btn btn-success fw-semibold"
                    onClick={() => setShowConfirm(false)}
                  >
                    <i className="bi bi-pencil-fill me-2" />
                    {tr.confirmCancel}
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={confirmLeave}
                  >
                    {tr.confirmYes}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)), url('${tour.image}') center/cover no-repeat`,
          minHeight: '200px',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <div className="container pb-4 pt-5 mt-4 text-white">
          <h1 className="fw-bold mb-0">{tr.title} {tour.name}</h1>
        </div>
      </div>

      <div className="container py-5">
        {/* Back link — above the form */}
        <button
          className="btn btn-link text-decoration-none ps-0 mb-3"
          style={{ color: 'var(--green-primary)', fontWeight: 600 }}
          onClick={() => safeNavigate(`/tour/${tour.id}`)}
        >
          <i className="bi bi-arrow-left me-1" />
          {tr.backToDetails}
        </button>

        <div className="row g-5 align-items-start">
          {/* ── Left: Form ── */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm p-4">
              <h4 className="fw-bold mb-4" style={{ color: 'var(--green-primary)' }}>
                <i className="bi bi-person-lines-fill me-2" />
                {tr.dataTitle}
              </h4>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">
                      {tr.nombres} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombres"
                      value={form.nombres}
                      onChange={handleChange}
                      required
                      placeholder="Ej: Juan Carlos"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">
                      {tr.apellidos} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="apellidos"
                      value={form.apellidos}
                      onChange={handleChange}
                      required
                      placeholder="Ej: García López"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">
                      {tr.telefono} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      required
                      placeholder="+51 999 999 999"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">
                      {tr.documento} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="documento"
                      value={form.documento}
                      onChange={handleChange}
                      required
                      placeholder="Ej: 12345678"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      {tr.correo} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                      required
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div className="col-sm-5">
                    <label className="form-label fw-semibold">
                      {tr.personas} <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="personas"
                      value={form.personas}
                      onChange={handleChange}
                      required
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {tr.personaOpt(n)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-sm-7">
                    <label className="form-label fw-semibold">
                      {tr.fecha} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="fecha"
                      value={form.fecha}
                      onChange={handleChange}
                      required
                      min={minDateStr}
                    />
                    <div className="form-text text-muted">
                      <i className="bi bi-info-circle me-1" />
                      {tr.fechaHint}
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      {tr.descripcion}
                    </label>
                    <textarea
                      className="form-control"
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      rows={4}
                      placeholder={tr.descripcionPh}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div>
                      <div className="text-muted small mb-1">{tr.totalLabel}</div>
                      <div className="fw-bold fs-2 lh-1" style={{ color: 'var(--green-primary)' }}>
                        ${total.toLocaleString('en-US')}
                        <span className="fs-6 fw-normal text-muted ms-2">USD</span>
                      </div>
                      <div className="text-muted small mt-1">
                        ${price} × {tr.personaOpt(Number(form.personas))}
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn fw-bold px-5 py-3 fs-5"
                      style={{
                        backgroundColor: 'var(--green-primary)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" />
                          {tr.sending}
                        </>
                      ) : (
                        <>
                          <i className="bi bi-credit-card me-2" />
                          {tr.pay}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* ── Right: Tour summary ── */}
          <div className="col-lg-5">
            <div
              className="card border-0 shadow-sm"
              style={{ position: 'sticky', top: '88px' }}
            >
              <img
                src={tour.image}
                alt={tour.name}
                className="card-img-top"
                style={{
                  height: '190px',
                  objectFit: 'cover',
                  borderRadius: '0.375rem 0.375rem 0 0',
                }}
              />
              <div className="card-body p-4">
                <h5 className="fw-bold mb-1">{tour.name}</h5>
                <p className="text-muted small mb-3">
                  <i className="bi bi-clock me-1" />
                  {tour.subtitle}
                </p>

                <div className="d-flex justify-content-between mb-2 small">
                  <span className="text-muted">{tr.summaryPrice}</span>
                  <span className="fw-semibold">${tour.price} USD</span>
                </div>
                <div className="d-flex justify-content-between mb-2 small">
                  <span className="text-muted">{tr.summaryPersons}</span>
                  <span className="fw-semibold">{form.personas}</span>
                </div>
                <div className="d-flex justify-content-between py-2 mb-3 border-top border-bottom fw-bold">
                  <span>{tr.summaryTotal}</span>
                  <span style={{ color: 'var(--green-primary)' }}>
                    ${total.toLocaleString('en-US')} USD
                  </span>
                </div>

                {tour.includes.length > 0 && (
                  <div>
                    <p className="fw-semibold mb-2 small">{tr.includes}</p>
                    <ul className="list-unstyled mb-0">
                      {tour.includes.map((item) => (
                        <li key={item} className="small mb-1 d-flex align-items-center gap-2">
                          <i className="bi bi-check-circle-fill text-success flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
