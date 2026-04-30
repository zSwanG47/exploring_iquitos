import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

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
                    <Link to={to}>
                      <i className="bi bi-chevron-right me-1 small" />
                      {labels[idx]}
                    </Link>
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
                  <Link to={`/tour/${id}`} style={{ textDecoration: 'none' }}>
                    <i className="bi bi-chevron-right me-1 small" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

        <div className="text-center small" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <p className="mb-0">
            &copy; {year} Exploring Iquitos. {tf.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
