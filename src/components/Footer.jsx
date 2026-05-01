import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { useNavigationGuard } from '../context/NavigationGuardContext'

const socialLinks = [
  { icon: 'bi-facebook',  href: '#', label: 'Facebook' },
  { icon: 'bi-instagram', href: '#', label: 'Instagram' },
  { icon: 'bi-tiktok',    href: '#', label: 'TikTok' },
  { icon: 'bi-youtube',   href: '#', label: 'YouTube' },
]

const quickLinks = [
  { label: 'Inicio',   to: '/inicio' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Tours',    to: '/tours' },
  { label: 'Galeria',  to: '/galeria' },
  { label: 'Contacto', to: '/contacto' },
]

const tourLinks = [
  { label: 'Tour Amazonas 5D/4N',    id: 'tour-amazonas-5d-4n' },
  { label: 'Tour Isla Bonita 4D/3N', id: 'tour-isla-bonita-4d-3n' },
  { label: 'Tour Mono Ardilla 3D/2N',id: 'tour-mono-ardilla-3d-2n' },
  { label: 'Full Day Amazonas',       id: 'fullday-amazonas' },
  { label: 'Full Day Nanay',          id: 'fullday-nanay' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const { t } = useLang()
  const tf = t.footer
  const nav = t.nav
  const { safeNavigate } = useNavigationGuard()

  const handleLink = (e, to) => {
    e.preventDefault()
    safeNavigate(to)
  }

  return (
    <footer className="footer pt-5 pb-3">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Col 1 — Empresa */}
          <div className="col-lg-4">
            <div className="d-flex align-items-center mb-3 gap-3">
              <img
                src="/images/logo.jpeg"
                alt="Exploring Iquitos"
                width="52"
                height="52"
                className="rounded-circle"
                style={{ objectFit: 'cover', border: '2px solid rgba(255,255,255,0.4)' }}
              />
              <h5 className="mb-0">Exploring Iquitos</h5>
            </div>
            <p className="small mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {tf.description}
            </p>
            {/* Redes sociales */}
            <div className="d-flex gap-3">
              {socialLinks.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <i className={`bi ${icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Links rapidos */}
          <div className="col-sm-6 col-lg-4">
            <h5 className="mb-3">{tf.quickLinks}</h5>
            <ul className="list-unstyled mb-0">
              {quickLinks.map(({ to }, idx) => {
                const labels = [nav.inicio, nav.nosotros, nav.tours, nav.galeria, nav.contacto]
                return (
                  <li key={to} className="mb-2">
                    <a href={to} onClick={(e) => handleLink(e, to)} style={{ textDecoration: 'none' }}>
                      <i className="bi bi-chevron-right me-1 small" />
                      {labels[idx]}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Col 3 — Nuestros tours */}
          <div className="col-sm-6 col-lg-4">
            <h5 className="mb-3">{tf.ourTours}</h5>
            <ul className="list-unstyled mb-0">
              {tourLinks.map(({ label, id }) => (
                <li key={id} className="mb-2">
                  <a href={`/tour/${id}`} onClick={(e) => handleLink(e, `/tour/${id}`)} style={{ textDecoration: 'none' }}>
                    <i className="bi bi-chevron-right me-1 small" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Métodos de pago ── */}
        <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        <div className="mb-4">
          <h6 className="text-center mb-3 fw-semibold" style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
            {tf.paymentMethods}
          </h6>
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
            {/* Yape */}
            <div className="payment-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#6B21A8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff' }}>Y</span>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Yape</span>
            </div>
            {/* Plin */}
            <div className="payment-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#00B4D8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff' }}>P</span>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Plin</span>
            </div>
            {/* PayPal */}
            <div className="payment-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="bi bi-paypal" style={{ color: '#009CDE', fontSize: '1.3rem' }} />
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>PayPal</span>
            </div>
            {/* Mastercard */}
            <div className="payment-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#EB001B', display: 'inline-block', marginRight: '-8px' }} />
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#F79E1B', display: 'inline-block' }} />
              </span>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Mastercard</span>
            </div>
            {/* Transferencia */}
            <div className="payment-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="bi bi-bank" style={{ color: '#56e39f', fontSize: '1.2rem' }} />
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Transferencia</span>
            </div>
          </div>
        </div>

        <div className="text-center small" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <p className="mb-0">
            &copy; {year} Exploring Iquitos. {tf.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
