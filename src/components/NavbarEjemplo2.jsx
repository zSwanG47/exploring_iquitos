import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import '../styles/navbar-selva.css'

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '/images/espana.png' },
  { code: 'en', label: 'English', flag: '/images/reino-unido.png' },
]

const SOCIAL = [
  { icon: 'bi-instagram', href: 'https://www.instagram.com/exploringiquitos?utm_source=qr&igsh=MTVvOTN0MTNkOGUyeg==', label: 'Instagram' },
  { icon: 'bi-facebook', href: 'https://www.facebook.com/share/18jENmCyF2/', label: 'Facebook' },
  { icon: 'bi-tiktok', href: 'https://www.tiktok.com/@exploringiquitos?_r=1&_t=ZS-964zTmmYiJD', label: 'TikTok' },
]

const WHATSAPP = 'https://wa.me/51925998156'

export default function NavbarEjemplo2() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t, lang, setLang } = useLang()
  const currentLang = LANGUAGES.find((l) => l.code === lang)

  const links = [
    { num: '01', label: t.nav.inicio, to: '/inicio' },
    { num: '02', label: t.nav.nosotros, to: '/nosotros' },
    { num: '03', label: t.nav.tours, to: '/tours', featured: true },
    { num: '04', label: t.nav.galeria, to: '/galeria' },
    { num: '05', label: t.nav.contacto, to: '/contacto' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
    setLangOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const go = (to) => {
    setDrawerOpen(false)
    navigate(to)
  }

  const isActive = (to) => pathname === to

  const ribbonLeft = lang === 'en'
    ? 'Iquitos · Loreto · Peru'
    : 'Iquitos · Loreto · Perú'

  const ribbonCenter = lang === 'en'
    ? 'Amazon River Basin'
    : 'Cuenca del Amazonas'

  const waLabel = lang === 'en' ? 'WhatsApp' : 'WhatsApp'

  return (
    <header className={`selva-head${scrolled ? ' selva-head--compact' : ''}`}>
      <div className="selva-head__ribbon">
        <div className="selva-head__ribbon-left">
          <i className="bi bi-geo-alt-fill" style={{ color: '#c4a035' }} />
          <span>{ribbonLeft}</span>
          <span className="selva-head__coord d-none d-sm-inline">3°44′S · 73°15′W</span>
        </div>
        <div className="selva-head__ribbon-center">
          <span className="selva-head__dot" />
          <span>{ribbonCenter}</span>
          <span className="selva-head__dot" />
        </div>
        <div className="selva-head__ribbon-right">
          {SOCIAL.map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="selva-head__social"
              aria-label={label}
            >
              <i className={`bi ${icon}`} />
            </a>
          ))}
        </div>
      </div>

      <div className="selva-head__body">
        <div className="container selva-head__inner">
          <a
            href="/inicio"
            className="selva-head__brand"
            onClick={(e) => { e.preventDefault(); go('/inicio') }}
          >
            <div className="selva-head__seal" aria-hidden="true">
              <span className="selva-head__seal-ring" />
              <span className="selva-head__seal-ring selva-head__seal-ring--inner" />
              <img src="/images/logo.jpeg" alt="" />
            </div>
            <div className="selva-head__brand-copy">
              <span className="selva-head__brand-top">Exploring</span>
              <span className="selva-head__brand-name">Iquitos</span>
              <span className="selva-head__brand-tag">{t.hero.tagline}</span>
            </div>
          </a>

          <nav className="selva-head__nav" aria-label="Main">
            {links.map(({ num, label, to, featured }) => (
              <button
                key={to}
                type="button"
                className={[
                  'selva-head__nav-item',
                  isActive(to) ? 'selva-head__nav-item--active' : '',
                  featured ? 'selva-head__nav-item--tours' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => go(to)}
              >
                <span className="selva-head__nav-num">{num}</span>
                <span className="selva-head__nav-label">{label}</span>
              </button>
            ))}
          </nav>

          <div className="selva-head__actions">
            <div className="selva-head__lang">
              <button
                type="button"
                className="selva-head__lang-btn"
                onClick={() => setLangOpen((o) => !o)}
                aria-label="Cambiar idioma"
              >
                <img src={currentLang.flag} alt="" />
                {lang.toUpperCase()}
              </button>
              {langOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 0 }}
                    onClick={() => setLangOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="selva-head__lang-menu">
                    {LANGUAGES.map(({ code, label, flag }) => (
                      <button
                        key={code}
                        type="button"
                        className={`selva-head__lang-opt${code === lang ? ' selva-head__lang-opt--active' : ''}`}
                        onClick={() => { setLang(code); setLangOpen(false) }}
                      >
                        <img src={flag} alt="" />
                        {label}
                        {code === lang && <i className="bi bi-check2 ms-auto" style={{ color: '#1a6b52' }} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="selva-head__wa"
            >
              <i className="bi bi-whatsapp" />
              {waLabel}
            </a>

            <button
              type="button"
              className={`selva-head__menu-btn${drawerOpen ? ' selva-head__menu-btn--open' : ''}`}
              onClick={() => setDrawerOpen((o) => !o)}
              aria-label={drawerOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={drawerOpen}
            >
              <span />
              <span />
              <span />
              <small>MENU</small>
            </button>
          </div>
        </div>

        <div className={`selva-head__drawer${drawerOpen ? ' selva-head__drawer--open' : ''}`}>
          <div className="selva-head__drawer-panel">
            <p className="selva-head__drawer-title">
              {lang === 'en' ? 'Route map' : 'Mapa de ruta'}
            </p>
            {links.map(({ num, label, to }) => (
              <button
                key={to}
                type="button"
                className={`selva-head__drawer-link${isActive(to) ? ' selva-head__drawer-link--active' : ''}`}
                onClick={() => go(to)}
              >
                <span className="selva-head__drawer-num">{num}</span>
                <span className="selva-head__drawer-label">{label}</span>
                <i className="bi bi-arrow-right selva-head__drawer-arrow" />
              </button>
            ))}
            <div className="selva-head__drawer-foot">
              <button
                type="button"
                className="selva-head__lang-btn"
                onClick={() => setLangOpen((o) => !o)}
              >
                <img src={currentLang.flag} alt="" />
                {lang.toUpperCase()}
              </button>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="selva-head__drawer-wa"
              >
                <i className="bi bi-whatsapp" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="selva-head__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 14" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="currentColor"
              d="M0,7 C120,14 240,0 360,7 C480,14 600,0 720,7 C840,14 960,0 1080,7 C1200,14 1320,0 1440,7 L1440,14 L0,14 Z"
            />
          </svg>
        </div>
      </div>

      <div
        className={`selva-head__drawer-backdrop${drawerOpen ? ' selva-head__drawer-backdrop--open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
    </header>
  )
}
