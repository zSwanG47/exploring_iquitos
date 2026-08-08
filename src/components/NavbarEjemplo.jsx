import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import '../styles/navbar-v2.css'

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '/images/espana.png' },
  { code: 'en', label: 'English', flag: '/images/reino-unido.png' },
]

const NAV_ICONS = {
  '/inicio': 'bi-house-door',
  '/nosotros': 'bi-people',
  '/tours': 'bi-compass',
  '/galeria': 'bi-images',
  '/contacto': 'bi-envelope',
}

export default function NavbarEjemplo() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t, lang, setLang } = useLang()
  const currentLang = LANGUAGES.find((l) => l.code === lang)

  const links = [
    { label: t.nav.inicio, to: '/inicio' },
    { label: t.nav.nosotros, to: '/nosotros' },
    { label: t.nav.tours, to: '/tours' },
    { label: t.nav.galeria, to: '/galeria' },
    { label: t.nav.contacto, to: '/contacto' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setLangOpen(false)
  }, [pathname])

  const go = (to) => {
    setMobileOpen(false)
    navigate(to)
  }

  const isActive = (to) => pathname === to || (pathname === '/ejemplo-header' && to === '/galeria')

  return (
    <header className={`nav-v2${scrolled ? ' nav-v2--scrolled' : ''}`}>
      <div className="nav-v2__bar">
        <div className="container nav-v2__inner">
          <a
            href="/inicio"
            className="nav-v2__brand"
            onClick={(e) => { e.preventDefault(); go('/inicio') }}
          >
            <div className="nav-v2__logo-wrap">
              <img src="/images/logo.jpeg" alt="" className="nav-v2__logo" />
            </div>
            <div className="nav-v2__brand-text">
              <span className="nav-v2__brand-eyebrow">Exploring</span>
              <span className="nav-v2__brand-name">Iquitos</span>
            </div>
          </a>

          <nav className="nav-v2__links d-none d-lg-flex" aria-label="Main">
            {links.map(({ label, to }) => (
              <button
                key={to}
                type="button"
                className={`nav-v2__link${isActive(to) ? ' nav-v2__link--active' : ''}`}
                onClick={() => go(to)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="nav-v2__actions">
            <div className="nav-v2__lang">
              <button
                type="button"
                className="nav-v2__lang-btn"
                onClick={() => setLangOpen((o) => !o)}
                aria-label="Cambiar idioma"
              >
                <img src={currentLang.flag} alt="" />
                {lang.toUpperCase()}
                <i className={`bi bi-chevron-${langOpen ? 'up' : 'down'}`} style={{ fontSize: '0.7rem' }} />
              </button>
              {langOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 0 }}
                    onClick={() => setLangOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="nav-v2__lang-menu">
                    {LANGUAGES.map(({ code, label, flag }) => (
                      <button
                        key={code}
                        type="button"
                        className={`nav-v2__lang-opt${code === lang ? ' nav-v2__lang-opt--active' : ''}`}
                        onClick={() => { setLang(code); setLangOpen(false) }}
                      >
                        <img src={flag} alt="" />
                        {label}
                        {code === lang && <i className="bi bi-check2 ms-auto" style={{ color: '#16a34a' }} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <a
              href="/tours"
              className="nav-v2__cta"
              onClick={(e) => { e.preventDefault(); go('/tours') }}
            >
              <i className="bi bi-calendar-check" />
              {lang === 'en' ? 'Book tour' : 'Reservar tour'}
            </a>

            <button
              type="button"
              className={`nav-v2__burger${mobileOpen ? ' nav-v2__burger--open' : ''}`}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div className={`nav-v2__mobile${mobileOpen ? ' nav-v2__mobile--open' : ''}`}>
          {links.map(({ label, to }) => (
            <button
              key={to}
              type="button"
              className={`nav-v2__mobile-link${isActive(to) ? ' nav-v2__mobile-link--active' : ''}`}
              onClick={() => go(to)}
            >
              <i className={`bi ${NAV_ICONS[to] || 'bi-circle'}`} />
              {label}
            </button>
          ))}
          <div className="nav-v2__mobile-footer">
            <button
              type="button"
              className="nav-v2__lang-btn"
              onClick={() => setLangOpen((o) => !o)}
            >
              <img src={currentLang.flag} alt="" />
              {lang.toUpperCase()}
            </button>
            <a
              href="/tours"
              className="nav-v2__mobile-cta"
              onClick={(e) => { e.preventDefault(); go('/tours') }}
            >
              {lang === 'en' ? 'Book' : 'Reservar'}
              <i className="bi bi-arrow-right" />
            </a>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="nav-v2__overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  )
}
