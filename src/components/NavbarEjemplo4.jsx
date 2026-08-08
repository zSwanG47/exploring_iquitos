import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import '../styles/navbar-guia.css'

const WA_NUMBER = '51925998156'
const PHONE_DISPLAY = '+51 925 998 156'

export default function NavbarEjemplo4() {
  const [scrolled, setScrolled] = useState(false)
  const tabsRef = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { t, lang, setLang } = useLang()

  const links = [
    { label: t.nav.inicio, to: '/inicio' },
    { label: t.nav.nosotros, to: '/nosotros' },
    { label: t.nav.tours, to: '/tours', primary: true },
    { label: t.nav.galeria, to: '/galeria' },
    { label: t.nav.contacto, to: '/contacto' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = tabsRef.current
    if (!el) return
    const active = el.querySelector('.guia-head__tab--active')
    active?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [pathname])

  const go = (to) => navigate(to)
  const isActive = (to) => pathname === to

  const replyNote = lang === 'en' ? 'We reply in ~15 min' : 'Respondemos en ~15 min'
  const waLabel = lang === 'en' ? 'WhatsApp' : 'WhatsApp'
  const brandHint = lang === 'en' ? 'Amazon tours · Iquitos' : 'Tours en la Amazonía · Iquitos'

  return (
    <header className={`guia-head${scrolled ? ' guia-head--scrolled' : ''}`}>
      <div className="guia-head__utility">
        <div className="container guia-head__utility-inner">
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="guia-head__phone"
          >
            <i className="bi bi-whatsapp" />
            {PHONE_DISPLAY}
          </a>
          <span className="guia-head__utility-note">{replyNote}</span>
          <div className="guia-head__utility-lang">
            <button
              type="button"
              className={`guia-head__lang-btn${lang === 'es' ? ' guia-head__lang-btn--active' : ''}`}
              onClick={() => setLang('es')}
            >
              ES
            </button>
            <span className="guia-head__lang-sep">/</span>
            <button
              type="button"
              className={`guia-head__lang-btn${lang === 'en' ? ' guia-head__lang-btn--active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <div className="guia-head__main">
        <div className="container guia-head__main-inner">
          <a
            href="/inicio"
            className="guia-head__brand"
            onClick={(e) => { e.preventDefault(); go('/inicio') }}
          >
            <img src="/images/logo.jpeg" alt="" className="guia-head__logo" />
            <div className="guia-head__brand-text">
              <span className="guia-head__brand-name">Exploring Iquitos</span>
              <span className="guia-head__brand-hint">{brandHint}</span>
            </div>
          </a>

          <nav className="guia-head__nav" aria-label="Principal">
            {links.map(({ label, to, primary }) => (
              <button
                key={to}
                type="button"
                className={[
                  'guia-head__link',
                  primary ? 'guia-head__link--tours' : '',
                  isActive(to) ? 'guia-head__link--active' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => go(to)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="guia-head__actions">
            <div className="guia-head__mobile-lang">
              <button
                type="button"
                className={`guia-head__lang-btn${lang === 'es' ? ' guia-head__lang-btn--active' : ''}`}
                onClick={() => setLang('es')}
              >
                ES
              </button>
              <span className="guia-head__lang-sep">/</span>
              <button
                type="button"
                className={`guia-head__lang-btn${lang === 'en' ? ' guia-head__lang-btn--active' : ''}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="guia-head__wa"
            >
              <i className="bi bi-whatsapp" />
              <span className="guia-head__wa-label">{waLabel}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="guia-head__tabs-wrap">
        <div className="guia-head__tabs" ref={tabsRef} role="tablist" aria-label="Secciones">
          {links.map(({ label, to, primary }) => (
            <button
              key={to}
              type="button"
              role="tab"
              aria-selected={isActive(to)}
              className={[
                'guia-head__tab',
                primary ? 'guia-head__tab--tours' : '',
                isActive(to) ? 'guia-head__tab--active' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => go(to)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
