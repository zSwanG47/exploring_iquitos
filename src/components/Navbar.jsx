import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { useNavigationGuard } from '../context/NavigationGuardContext'

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '/images/espana.png' },
  { code: 'en', label: 'English', flag: '/images/reino-unido.png' },
]

function LangSwitcher({ inOffcanvas = false }) {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find((l) => l.code === lang)

  return (
    <div className="position-relative" style={{ zIndex: 200 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="d-flex align-items-center gap-2 border-0"
        style={{
          background: inOffcanvas ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3) !important',
          color: '#fff',
          borderRadius: '7px',
          padding: '5px 11px',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: 'none',
        }}
        aria-label="Cambiar idioma"
      >
        <img
          src={current.flag}
          alt={current.label}
          width={22}
          height={15}
          style={{ objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }}
        />
        <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.03em' }}>
          {current.code.toUpperCase()}
        </span>
        <i className={`bi bi-chevron-${open ? 'up' : 'down'}`} style={{ fontSize: '11px', opacity: 0.8 }} />
      </button>

      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 0 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 6px)',
              background: '#fff',
              borderRadius: '10px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
              minWidth: '140px',
              zIndex: 300,
              overflow: 'hidden',
            }}
          >
            {LANGUAGES.map(({ code, label, flag }) => (
              <button
                key={code}
                className="d-flex align-items-center gap-2 w-100 border-0 px-3 py-2"
                style={{
                  background: code === lang ? '#edf7f1' : 'transparent',
                  color: '#145228',
                  fontSize: '14px',
                  fontWeight: code === lang ? 700 : 500,
                  cursor: 'pointer',
                }}
                onClick={() => { setLang(code); setOpen(false) }}
              >
                <img
                  src={flag}
                  alt={label}
                  width={24}
                  height={16}
                  style={{ objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }}
                />
                {label}
                {code === lang && (
                  <i className="bi bi-check2 ms-auto" style={{ color: 'var(--green-primary)' }} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [offcanvasOpen, setOffcanvasOpen] = useState(false)
  const navigate = useNavigate()
  const { t } = useLang()
  const { safeNavigate } = useNavigationGuard()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e, to) => {
    e.preventDefault()
    setOffcanvasOpen(false)
    safeNavigate(to)
  }

  const links = [
    { label: t.nav.inicio,   to: '/inicio' },
    { label: t.nav.nosotros, to: '/nosotros' },
    { label: t.nav.tours,    to: '/tours' },
    { label: t.nav.galeria,  to: '/galeria' },
    { label: t.nav.contacto, to: '/contacto' },
  ]

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg fixed-top navbar-custom${scrolled ? ' shadow' : ''}`}
      >
        <div className="container">
          {/* Brand */}
          <a
            className="navbar-brand d-flex align-items-center gap-2"
            href="/inicio"
            onClick={(e) => handleNavClick(e, '/inicio')}
          >
            <img
              src="/images/logo.jpeg"
              alt="Exploring Iquitos"
              width="44"
              height="44"
              className="rounded-circle border border-2 border-white"
              style={{ objectFit: 'cover' }}
            />
            <span className="text-white fw-bold fs-5">Exploring Iquitos</span>
          </a>

          {/* Desktop links + switcher */}
          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav ms-auto gap-lg-1 align-items-center">
              {links.map(({ label, to }) => (
                <li className="nav-item" key={to}>
                  <a
                    className="nav-link text-white fw-semibold px-3 py-2"
                    href={to}
                    onClick={(e) => handleNavClick(e, to)}
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li className="nav-item ms-2">
                <LangSwitcher />
              </li>
            </ul>
          </div>

          {/* Mobile: hamburger only */}
          <div className="d-flex d-lg-none align-items-center">
            <button
              className="navbar-toggler border-0 p-0"
              type="button"
              onClick={() => setOffcanvasOpen(true)}
              aria-label="Abrir menú"
            >
              <span className="navbar-toggler-icon" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Offcanvas mobile menu ── */}
      <div
        className={`offcanvas-backdrop fade${offcanvasOpen ? ' show' : ''}`}
        style={{ display: offcanvasOpen ? 'block' : 'none' }}
        onClick={() => setOffcanvasOpen(false)}
      />

      <div
        className={`offcanvas offcanvas-end${offcanvasOpen ? ' show' : ''}`}
        style={{
          visibility: offcanvasOpen ? 'visible' : 'hidden',
          background: 'var(--green-dark, #145228)',
          width: '280px',
        }}
        tabIndex="-1"
      >
        {/* Header */}
        <div className="offcanvas-header border-bottom" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
          <div className="d-flex align-items-center gap-2">
            <img
              src="/images/logo.jpeg"
              alt="Exploring Iquitos"
              width="38"
              height="38"
              className="rounded-circle border border-2 border-white"
              style={{ objectFit: 'cover' }}
            />
            <span className="text-white fw-bold">Exploring Iquitos</span>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setOffcanvasOpen(false)}
            aria-label="Cerrar menú"
          />
        </div>

        {/* Body */}
        <div className="offcanvas-body p-0">
          <ul className="nav flex-column pt-2">
            {links.map(({ label, to }, i) => (
              <li className="nav-item" key={to}>
                <a
                  href={to}
                  onClick={(e) => handleNavClick(e, to)}
                  className="nav-link text-white fw-semibold px-4 py-3 d-flex align-items-center gap-3"
                  style={{
                    borderBottom: i < links.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <i className="bi bi-chevron-right small opacity-75" />
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Social icons at bottom */}
          <div
            className="d-flex gap-3 px-4 py-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '16px' }}
          >
            {[
              { icon: 'bi-facebook',  href: '#', label: 'Facebook' },
              { icon: 'bi-instagram', href: '#', label: 'Instagram' },
              { icon: 'bi-tiktok',    href: '#', label: 'TikTok' },
              { icon: 'bi-youtube',   href: '#', label: 'YouTube' },
            ].map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white opacity-75"
                style={{ fontSize: '1.2rem', transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.75')}
              >
                <i className={`bi ${icon}`} />
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* ── Floating lang switcher (mobile only) ── */}
      <FloatingLangSwitcher />
    </>
  )
}

function FloatingLangSwitcher() {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find((l) => l.code === lang)

  return (
    <div
      className="d-lg-none"
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '28px',
        zIndex: 9998,
      }}
    >
      {/* Dropdown (opens upward) */}
      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 0 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 'calc(100% + 8px)',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.22)',
              minWidth: '148px',
              zIndex: 1,
              overflow: 'hidden',
            }}
          >
            {LANGUAGES.map(({ code, label, flag }) => (
              <button
                key={code}
                className="d-flex align-items-center gap-2 w-100 border-0 px-3 py-2"
                style={{
                  background: code === lang ? '#edf7f1' : 'transparent',
                  color: '#145228',
                  fontSize: '14px',
                  fontWeight: code === lang ? 700 : 500,
                  cursor: 'pointer',
                }}
                onClick={() => { setLang(code); setOpen(false) }}
              >
                <img
                  src={flag}
                  alt={label}
                  width={24}
                  height={16}
                  style={{ objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }}
                />
                {label}
                {code === lang && (
                  <i className="bi bi-check2 ms-auto" style={{ color: 'var(--green-primary)' }} />
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Floating pill button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="d-flex align-items-center gap-2 border-0"
        style={{
          background: 'var(--green-primary, #1d7a3d)',
          color: '#fff',
          borderRadius: '50px',
          padding: '9px 16px',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          outline: 'none',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        aria-label="Cambiar idioma"
      >
        <img
          src={current.flag}
          alt={current.label}
          width={24}
          height={16}
          style={{ objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }}
        />
        <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em' }}>
          {current.code.toUpperCase()}
        </span>
        <i
          className={`bi bi-chevron-${open ? 'down' : 'up'}`}
          style={{ fontSize: '11px', opacity: 0.85 }}
        />
      </button>
    </div>
  )
}
