import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { getTourById, getLocalizedTour } from '../data/toursData'
import { useLang } from '../context/LanguageContext'
import { useTourPrice } from '../context/TourPricesContext'
import TourPriceDisplay from '../components/TourPriceDisplay'
import AppNotice from '../components/AppNotice'
import { useNavigationGuard } from '../context/NavigationGuardContext'
import '../styles/reservar.css'

export default function Reservar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const tr = t.reservar
  const { price, loading: priceLoading } = useTourPrice(id)
  const tour = getLocalizedTour(getTourById(id), lang)
  const { dirty, setDirty, safeNavigate } = useNavigationGuard()

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

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDateStr = [
    tomorrow.getFullYear(),
    String(tomorrow.getMonth() + 1).padStart(2, '0'),
    String(tomorrow.getDate()).padStart(2, '0'),
  ].join('-')

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('form')
  const [reservaToken, setReservaToken] = useState(null)
  const [serverTotal, setServerTotal] = useState(null)
  const [error, setError] = useState('')
  const [payError, setPayError] = useState('')
  const [payLoading, setPayLoading] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id, step])

  useEffect(() => {
    if (tour) {
      document.title = `${tr.title} ${tour.name} | Exploring Iquitos`
    }
    return () => {
      document.title = 'Exploring Iquitos | Tours en la Amazonia Peruana'
    }
  }, [tour, tr.title])

  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  if (!tour) {
    return (
      <div className="reservar-page">
        <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
          <h2>{tr.notFound}</h2>
          <button type="button" className="reservar-page__btn-pay mt-3" onClick={() => navigate('/')}>
            {tr.backHome}
          </button>
        </div>
      </div>
    )
  }

  const total = serverTotal ?? (price != null ? price * Number(form.personas) : 0)
  const canReserve = !priceLoading && price != null

  const handleChange = (e) => {
    const { name, value } = e.target
    setDirty(true)
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tour_id: tour.id,
          nombres: form.nombres,
          apellidos: form.apellidos,
          telefono: form.telefono,
          documento: form.documento,
          correo: form.correo,
          personas: Number(form.personas),
          fecha: form.fecha,
          descripcion: form.descripcion,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'create failed')

      setReservaToken(data.ref_token)
      setServerTotal(data.total_usd)
      setDirty(false)
      setStep('payment')
    } catch {
      setError(tr.errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="reservar-page">
        <div className="reservar-page__success">
          <i className="bi bi-check-circle-fill reservar-page__success-icon" />
          <h2>{tr.successTitle}</h2>
          <p className="reservar-page__success-msg">{tr.successMsg(form.nombres)}</p>
          <p className="reservar-page__success-sub">{tr.successSub}</p>
          <button type="button" className="reservar-page__btn-pay" onClick={() => navigate('/')}>
            {tr.backHome}
          </button>
        </div>
      </div>
    )
  }

  if (step === 'payment') {
    return (
      <div className="reservar-page">
        <div className="container reservar-page__body">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="reservar-page__payment-card">
                <h2 className="reservar-page__form-title">
                  <i className="bi bi-paypal" />
                  {tr.payTitle}
                </h2>
                <p className="reservar-page__payment-sub">{tr.paySubtitle}</p>

                <div className="reservar-page__payment-amount">
                  <span>{tr.payAmount}</span>
                  <span className="reservar-page__payment-total">
                    ${total.toFixed(2)} <small>USD</small>
                  </span>
                </div>

                {payError && (
                  <AppNotice variant="error">{payError}</AppNotice>
                )}

                <PayPalButtons
                  style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
                  disabled={payLoading}
                  createOrder={(_data, actions) =>
                    actions.order.create({
                      purchase_units: [{
                        amount: { value: total.toFixed(2) },
                        description: `${tour.name} × ${form.personas} persona(s)`,
                      }],
                    })
                  }
                  onApprove={async (data) => {
                    setPayLoading(true)
                    setPayError('')
                    try {
                      const res = await fetch('/api/reservas/confirm', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          ref_token: reservaToken,
                          orderID: data.orderID,
                        }),
                      })
                      const json = await res.json()
                      if (!res.ok) throw new Error(json.error || 'confirm failed')
                      setStep('success')
                    } catch {
                      setPayError(tr.payError)
                    } finally {
                      setPayLoading(false)
                    }
                  }}
                  onError={() => setPayError(tr.payError)}
                />

                <button
                  type="button"
                  className="reservar-page__pay-cancel"
                  onClick={() => setStep('form')}
                >
                  <i className="bi bi-arrow-left" />
                  {tr.payCancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reservar-page">
      <header className="reservar-page__hero">
        <div
          className="reservar-page__hero-bg"
          style={{ backgroundImage: `url('${tour.image}')` }}
        />
        <div className="reservar-page__hero-overlay" />
        <div className="container reservar-page__hero-content">
          <p className="reservar-page__hero-label">Exploring Iquitos</p>
          <h1 className="reservar-page__hero-title">
            {tr.title} {tour.name}
          </h1>
          <div className="reservar-page__hero-meta">
            <span className="reservar-page__pill reservar-page__pill--duration">
              <i className="bi bi-clock" />
              {tour.subtitle}
            </span>
            <span className="reservar-page__pill reservar-page__pill--price">
              <i className="bi bi-tag-fill" />
              <TourPriceDisplay price={price} loading={priceLoading} />
              {!priceLoading && price != null && ' USD'}
            </span>
          </div>
        </div>
      </header>

      <div className="container reservar-page__body">
        <button
          type="button"
          className="reservar-page__back-link"
          onClick={() => safeNavigate(`/tour/${tour.id}`)}
        >
          <i className="bi bi-arrow-left" />
          {tr.backToDetails}
        </button>

        <div className="row g-4 g-lg-5 align-items-start">
          <div className="col-lg-7">
            <div className="reservar-page__form-card">
              <h2 className="reservar-page__form-title">
                <i className="bi bi-person-lines-fill" />
                {tr.dataTitle}
              </h2>

              {error && (
                <AppNotice variant="error">{error}</AppNotice>
              )}

              <form id="reservar-form" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="reservar-page__label">
                      {tr.nombres} <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="reservar-page__input"
                      name="nombres"
                      value={form.nombres}
                      onChange={handleChange}
                      required
                      placeholder={tr.nombresPh}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="reservar-page__label">
                      {tr.apellidos} <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="reservar-page__input"
                      name="apellidos"
                      value={form.apellidos}
                      onChange={handleChange}
                      required
                      placeholder={tr.apellidosPh}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="reservar-page__label">
                      {tr.telefono} <span className="req">*</span>
                    </label>
                    <input
                      type="tel"
                      className="reservar-page__input"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      required
                      placeholder={tr.telefonoPh}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="reservar-page__label">
                      {tr.documento} <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="reservar-page__input"
                      name="documento"
                      value={form.documento}
                      onChange={handleChange}
                      required
                      placeholder={tr.documentoPh}
                    />
                  </div>
                  <div className="col-12">
                    <label className="reservar-page__label">
                      {tr.correo} <span className="req">*</span>
                    </label>
                    <input
                      type="email"
                      className="reservar-page__input"
                      name="correo"
                      value={form.correo}
                      onChange={handleChange}
                      required
                      placeholder={tr.correoPh}
                    />
                  </div>
                  <div className="col-sm-5">
                    <label className="reservar-page__label">
                      {tr.personas} <span className="req">*</span>
                    </label>
                    <select
                      className="reservar-page__select"
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
                    <label className="reservar-page__label">
                      {tr.fecha} <span className="req">*</span>
                    </label>
                    <input
                      type="date"
                      className="reservar-page__input"
                      name="fecha"
                      value={form.fecha}
                      onChange={handleChange}
                      required
                      min={minDateStr}
                    />
                    <div className="reservar-page__hint">
                      <i className="bi bi-info-circle" />
                      {tr.fechaHint}
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="reservar-page__label">{tr.descripcion}</label>
                    <textarea
                      className="reservar-page__textarea"
                      name="descripcion"
                      value={form.descripcion}
                      onChange={handleChange}
                      rows={4}
                      placeholder={tr.descripcionPh}
                    />
                  </div>
                </div>

                <div className="reservar-page__footer">
                  <div>
                    <div className="reservar-page__total-label">{tr.totalLabel}</div>
                    <div className="reservar-page__total-amount">
                      {priceLoading ? (
                        <span className="spinner-border spinner-border-sm" role="status" />
                      ) : price != null ? (
                        <>
                          ${total.toLocaleString('en-US')}
                          <span className="unit">USD</span>
                        </>
                      ) : (
                        <span className="unit">—</span>
                      )}
                    </div>
                    {price != null && (
                      <div className="reservar-page__total-breakdown">
                        ${price} × {tr.personaOpt(Number(form.personas))}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="reservar-page__btn-pay"
                    disabled={loading || !canReserve}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" />
                        {tr.sending}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-credit-card" />
                        {tr.pay}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-5">
            <aside className="reservar-page__aside">
              <div className="reservar-page__summary">
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="reservar-page__summary-img"
                />
                <div className="reservar-page__summary-body">
                  <h3 className="reservar-page__summary-name">{tour.name}</h3>
                  <p className="reservar-page__summary-duration">
                    <i className="bi bi-clock me-1" />
                    {tour.subtitle}
                  </p>

                  <div className="reservar-page__summary-row">
                    <span>{tr.summaryPrice}</span>
                    <span>
                      <TourPriceDisplay price={price} loading={priceLoading} /> USD
                    </span>
                  </div>
                  <div className="reservar-page__summary-row">
                    <span>{tr.summaryPersons}</span>
                    <span>{form.personas}</span>
                  </div>
                  <div className="reservar-page__summary-total">
                    <span>{tr.summaryTotal}</span>
                    <span>${total.toLocaleString('en-US')} USD</span>
                  </div>

                  {tour.includes.length > 0 && (
                    <>
                      <p className="reservar-page__includes-title">{tr.includes}</p>
                      <ul className="reservar-page__includes-list">
                        {tour.includes.map((item) => (
                          <li key={item}>
                            <i className="bi bi-check-circle-fill" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="reservar-page__mobile-bar">
        <div>
          <div className="reservar-page__mobile-bar-label">{tr.summaryTotal}</div>
          <div className="reservar-page__mobile-bar-price">
            {priceLoading ? '…' : price != null ? `$${total.toLocaleString('en-US')}` : '—'}
          </div>
        </div>
        <button
          type="submit"
          form="reservar-form"
          className="reservar-page__btn-pay"
          disabled={loading || !canReserve}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" />
          ) : (
            <>
              <i className="bi bi-credit-card" />
              {tr.pay}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
