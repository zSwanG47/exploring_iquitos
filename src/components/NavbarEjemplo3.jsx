import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import '../styles/navbar-horizonte.css'

export default function NavbarEjemplo3() {
  const [solid, setSolid] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t, lang, setLang } = useLang()

  const links = [
    { label: t.nav.inicio, to: '/inicio' },
    { label: t.nav.nosotros, to: '/nosotros' },
    { label: t.nav.tours, to: '/tours' },
    { label: t.nav.galeria, to: '/galeria' },
    { label: t.nav.contacto, to: '/contacto' },
  ]

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const go = (to) => {
    setMenuOpen(false)
    navigate(to)
  }

  const isActive = (to) => pathname === to

  const toursLabel = lang === 'en' ? 'Tours' : 'Tours'

  return (
    <>
      <header className={`rio-head${solid ? ' rio-head--solid' : ''}`}>
        <div className="container rio-head__inner">
          <a
            href="/inicio"
            className="rio-head__brand"
            onClick={(e) => { e.preventDefault(); go('/inicio') }}
          >
            <img src="/images/logo.jpeg" alt="" className="rio-head__logo" />
            <div className="rio-head__brand-lines">
              <span className="rio-head__brand-name">Exploring Iquitos</span>
              <span className="rio-head__brand-sub">
                {lang === 'en' ? 'Peruvian Amazon' : 'Amazonía Peruana'}
              </span>
            </div>
          </a>

          <nav className="rio-head__nav" aria-label="Main">
            {links.map(({ label, to }) => (
              <button
                key={to}
                type="button"
                className={`rio-head__link${isActive(to) ? ' rio-head__link--active' : ''}`}
                onClick={() => go(to)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="rio-head__actions">
            <div className="rio-head__lang" role="group" aria-label="Idioma">
              <button
                type="button"
                className={`rio-head__lang-opt${lang === 'es' ? ' rio-head__lang-opt--active' : ''}`}
                onClick={() => setLang('es')}
              >
                ES
              </button>
              <button
                type="button"
                className={`rio-head__lang-opt${lang === 'en' ? ' rio-head__lang-opt--active' : ''}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              className="rio-head__tours"
              onClick={() => go('/tours')}
            >
              {toursLabel}
              <i className="bi bi-arrow-right" />
            </button>

            <button
              type="button"
              className={`rio-head__burger${menuOpen ? ' rio-head__burger--open' : ''}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`rio-head__screen${menuOpen ? ' rio-head__screen--open' : ''}`}>
        {links.map(({ label, to }) => (
          <button
            key={to}
            type="button"
            className={`rio-head__screen-link${isActive(to) ? ' rio-head__screen-link--active' : ''}`}
            onClick={() => go(to)}
          >
            {label}
          </button>
        ))}
        <div className="rio-head__screen-foot">
          <div className="rio-head__lang">
            <button
              type="button"
              className={`rio-head__lang-opt${lang === 'es' ? ' rio-head__lang-opt--active' : ''}`}
              onClick={() => setLang('es')}
            >
              ES
            </button>
            <button
              type="button"
              className={`rio-head__lang-opt${lang === 'en' ? ' rio-head__lang-opt--active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
