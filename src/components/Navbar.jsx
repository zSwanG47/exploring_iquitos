import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { useNavigationGuard } from '../context/NavigationGuardContext'
import { tours, getLocalizedTour } from '../data/toursData'
import '../styles/navbar-mega.css'

const LANGUAGES = [
  { code: 'es', label: 'ES', flag: '/images/espana.png', name: 'Español' },
  { code: 'en', label: 'EN', flag: '/images/reino-unido.png', name: 'English' },
]

const WA_NUMBER = '51925998156'
const MULTI_DAY_IDS = ['tour-amazonas-5d-4n', 'tour-isla-bonita-4d-3n', 'tour-mono-ardilla-3d-2n']
const FULL_DAY_IDS = ['fullday-amazonas', 'fullday-nanay']

function LangToggle({ lang, setLang, compact = false }) {
  return (
    <div className="mega-head__lang" role="group" aria-label="Idioma">
      {LANGUAGES.map(({ code, label, flag, name }) => (
        <button
          key={code}
          type="button"
          className={`mega-head__lang-btn${lang === code ? ' mega-head__lang-btn--active' : ''}`}
          onClick={() => setLang(code)}
          aria-label={name}
          title={name}
        >
          <img src={flag} alt="" />
          {!compact && label}
        </button>
      ))}
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toursTriggerRef = useRef(null)
  const mobileTabsRef = useRef(null)
  const { pathname } = useLocation()
  const { t, lang, setLang } = useLang()
  const { safeNavigate } = useNavigationGuard()

  const multiDay = tours.filter((tour) => MULTI_DAY_IDS.includes(tour.id))
  const fullDay = tours.filter((tour) => FULL_DAY_IDS.includes(tour.id))

  const drawerLinks = [
    { label: t.nav.inicio, to: '/inicio' },
    { label: t.nav.nosotros, to: '/nosotros' },
    { label: t.nav.galeria, to: '/galeria' },
    { label: t.nav.contacto, to: '/contacto' },
  ]

  const closeMega = useCallback(() => setMegaOpen(false), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    closeMega()
    setDrawerOpen(false)
  }, [pathname, closeMega])

  useEffect(() => {
    const el = mobileTabsRef.current
    if (!el) return
    const active = el.querySelector('.mega-head__tab--active')
    active?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  useEffect(() => {
    if (!megaOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeMega()
        toursTriggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [megaOpen, closeMega])

  const go = (to) => {
    closeMega()
    setDrawerOpen(false)
    safeNavigate(to)
  }

  const isActive = (to) => pathname === to
  const isToursSection = pathname === '/tours' || pathname.startsWith('/tour/') || pathname.startsWith('/reservar/')

  const megaLabels = lang === 'en'
    ? { multi: 'Multi-day tours', full: 'Full day', promoTitle: 'Tour Amazonas', promoDesc: 'The most complete Amazon experience.', all: 'View all tours', menu: 'Menu', wa: 'WhatsApp' }
    : { multi: 'Tours multi-día', full: 'Full day', promoTitle: 'Tour Amazonas', promoDesc: 'La experiencia más completa de la Amazonía.', all: 'Ver todos los tours', menu: 'Menú', wa: 'WhatsApp' }

  return (
    <>
      <header className={`mega-head${scrolled ? ' mega-head--scrolled' : ''}${drawerOpen ? ' mega-head--drawer-open' : ''}`}>
        <div className="mega-head__wrap">
          <div className="container mega-head__shell">
            <div className="mega-head__inner">
              <a
                href="/inicio"
                className="mega-head__brand"
                onClick={(e) => { e.preventDefault(); go('/inicio') }}
              >
                <img src="/images/logo.jpeg" alt="Exploring Iquitos" className="mega-head__logo" />
                <div className="mega-head__brand-name">
                  Exploring Iquitos
                  <span>{lang === 'en' ? 'Peruvian Amazon' : 'Amazonía Peruana'}</span>
                </div>
              </a>

              <nav className="mega-head__nav" aria-label="Principal">
                <button
                  type="button"
                  className={`mega-head__link${isActive('/inicio') ? ' mega-head__link--active' : ''}`}
                  onClick={() => go('/inicio')}
                >
                  {t.nav.inicio}
                </button>
                <button
                  type="button"
                  className={`mega-head__link${isActive('/nosotros') ? ' mega-head__link--active' : ''}`}
                  onClick={() => go('/nosotros')}
                >
                  {t.nav.nosotros}
                </button>
                <button
                  ref={toursTriggerRef}
                  type="button"
                  className={`mega-head__link mega-head__tours-trigger${isToursSection ? ' mega-head__link--active' : ''}`}
                  aria-expanded={megaOpen}
                  aria-controls="mega-tours-panel"
                  onClick={() => setMegaOpen((o) => !o)}
                >
                  {t.nav.tours}
                  <i className="bi bi-chevron-down" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`mega-head__link${isActive('/galeria') ? ' mega-head__link--active' : ''}`}
                  onClick={() => go('/galeria')}
                >
                  {t.nav.galeria}
                </button>
                <button
                  type="button"
                  className={`mega-head__link${isActive('/contacto') ? ' mega-head__link--active' : ''}`}
                  onClick={() => go('/contacto')}
                >
                  {t.nav.contacto}
                </button>
              </nav>

              <div className="mega-head__actions">
                <LangToggle lang={lang} setLang={setLang} />

                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mega-head__wa-btn"
                  aria-label="WhatsApp"
                >
                  <i className="bi bi-whatsapp" />
                  <span className="mega-head__wa-label">{megaLabels.wa}</span>
                </a>

                <button
                  type="button"
                  className={`mega-head__menu-btn${drawerOpen ? ' mega-head__menu-btn--open' : ''}`}
                  onClick={() => setDrawerOpen((o) => !o)}
                  aria-label={drawerOpen ? 'Cerrar menú' : 'Abrir menú'}
                  aria-expanded={drawerOpen}
                >
                  <span /><span /><span />
                </button>
              </div>
            </div>

            <nav className="mega-head__mobile-tabs" aria-label="Secciones" ref={mobileTabsRef}>
              {[
                { label: t.nav.inicio, to: '/inicio' },
                { label: t.nav.nosotros, to: '/nosotros' },
                { label: t.nav.tours, to: '/tours', tours: true },
                { label: t.nav.galeria, to: '/galeria' },
                { label: t.nav.contacto, to: '/contacto' },
              ].map(({ label, to, tours: isToursTab }) => (
                <button
                  key={to}
                  type="button"
                  className={[
                    'mega-head__tab',
                    isToursTab ? 'mega-head__tab--tours' : '',
                    isToursTab ? isToursSection && 'mega-head__tab--active' : isActive(to) && 'mega-head__tab--active',
                  ].filter(Boolean).join(' ')}
                  onClick={() => (isToursTab ? setDrawerOpen(true) : go(to))}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div id="mega-tours-panel" className="mega-head__panel" hidden={!megaOpen}>
            {megaOpen && (
              <div
                style={{ position: 'fixed', inset: 0, zIndex: -1 }}
                onClick={closeMega}
                aria-hidden="true"
              />
            )}
            <div className="container mega-head__panel-grid">
              <div className="mega-head__panel-col">
                <h3>{megaLabels.multi}</h3>
                {multiDay.map((tour) => {
                  const loc = getLocalizedTour(tour, lang)
                  return (
                    <button
                      key={tour.id}
                      type="button"
                      className="mega-head__tour-link"
                      onClick={() => go(`/tour/${tour.id}`)}
                    >
                      <img src={loc.image} alt="" />
                      <div>
                        <strong>{loc.name}</strong>
                        <small>{loc.subtitle}</small>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="mega-head__panel-col">
                <h3>{megaLabels.full}</h3>
                {fullDay.map((tour) => {
                  const loc = getLocalizedTour(tour, lang)
                  return (
                    <button
                      key={tour.id}
                      type="button"
                      className="mega-head__tour-link"
                      onClick={() => go(`/tour/${tour.id}`)}
                    >
                      <img src={loc.image} alt="" />
                      <div>
                        <strong>{loc.name}</strong>
                        <small>{loc.subtitle}</small>
                      </div>
                    </button>
                  )
                })}
                <button type="button" className="mega-head__panel-all" onClick={() => go('/tours')}>
                  {megaLabels.all}
                  <i className="bi bi-arrow-right" />
                </button>
              </div>
              <div className="mega-head__panel-col">
                <div className="mega-head__promo">
                  <div className="mega-head__promo-bg" aria-hidden="true" />
                  <h4>{megaLabels.promoTitle}</h4>
                  <p>{megaLabels.promoDesc}</p>
                  <button
                    type="button"
                    className="mega-head__promo-btn"
                    onClick={() => go('/tour/tour-amazonas-5d-4n')}
                  >
                    {lang === 'en' ? 'View details' : 'Ver detalle'}
                    <i className="bi bi-arrow-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`mega-head__drawer-backdrop${drawerOpen ? ' mega-head__drawer-backdrop--open' : ''}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      <aside className={`mega-head__drawer${drawerOpen ? ' mega-head__drawer--open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="mega-head__drawer-head">
          <strong>{megaLabels.menu}</strong>
          <button type="button" className="mega-head__drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className="mega-head__drawer-body">
          {drawerLinks.map(({ label, to }) => (
            <button
              key={to}
              type="button"
              className={`mega-head__drawer-link${isActive(to) ? ' mega-head__drawer-link--active' : ''}`}
              onClick={() => go(to)}
            >
              {label}
            </button>
          ))}

          <div className="mega-head__drawer-section">
            <h3>{t.nav.tours}</h3>
            {[...multiDay, ...fullDay].map((tour) => {
              const loc = getLocalizedTour(tour, lang)
              return (
                <button
                  key={tour.id}
                  type="button"
                  className="mega-head__drawer-tour"
                  onClick={() => go(`/tour/${tour.id}`)}
                >
                  <img src={loc.image} alt="" />
                  <span>{loc.name}</span>
                </button>
              )
            })}
            <button type="button" className="mega-head__panel-all" onClick={() => go('/tours')}>
              {megaLabels.all}
            </button>
          </div>

          <div className="mega-head__drawer-lang">
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      </aside>
    </>
  )
}
