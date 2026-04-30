import { useLang } from '../context/LanguageContext'

export default function Hero() {
  const { t } = useLang()
  return (
    <section id="inicio" className="hero-section">
      <div className="container text-white">
        <img
          src="/images/logo.jpeg"
          alt="Exploring Iquitos"
          className="hero-logo mb-4"
        />
        <h1 className="display-3 fw-bold mb-3">Exploring Iquitos</h1>
        <p className="lead fs-4 mb-2" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {t.hero.tagline}
        </p>
        <p className="mb-5" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {t.hero.sub}
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <a href="#tours" className="btn btn-success btn-lg px-5 py-3 fw-bold">
            <i className="bi bi-map me-2" />
            {t.hero.btnTours}
          </a>
          <a href="#contacto" className="btn btn-outline-light btn-lg px-5 py-3 fw-bold">
            <i className="bi bi-envelope me-2" />
            {t.hero.btnContact}
          </a>
        </div>
      </div>
    </section>
  )
}
