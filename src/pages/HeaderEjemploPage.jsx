import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import NavbarEjemplo from '../components/NavbarEjemplo'

export default function HeaderEjemploPage() {
  const { lang } = useLang()

  return (
    <div className="header-ejemplo-page">
      <NavbarEjemplo />

      <section className="header-ejemplo-hero">
        <div>
          <p className="header-ejemplo-banner">
            <i className="bi bi-stars me-1" />
            {lang === 'en'
              ? 'Header design preview — scroll to see the sticky effect'
              : 'Vista de ejemplo del header — haz scroll para ver el efecto sticky'}
          </p>
          <h1>Exploring Iquitos</h1>
          <p>
            {lang === 'en'
              ? 'Glass bar, pill navigation, vivid green accents and mobile dropdown menu.'
              : 'Barra glass, navegación en pills, acentos verdes y menú móvil desplegable.'}
          </p>
          <Link to="/" className="btn btn-success px-4 py-2 fw-semibold">
            {lang === 'en' ? 'Back to current site' : 'Volver al sitio actual'}
          </Link>
          <Link to="/ejemplo-header-2" className="btn btn-outline-light px-4 py-2 fw-semibold ms-2">
            {lang === 'en' ? 'Design B' : 'Diseño B'}
          </Link>
          <Link to="/ejemplo-header-3" className="btn btn-outline-light px-4 py-2 fw-semibold ms-2">
            {lang === 'en' ? 'Design C' : 'Diseño C'}
          </Link>
          <Link to="/ejemplo-header-5" className="btn btn-warning px-4 py-2 fw-semibold ms-2 text-dark">
            {lang === 'en' ? 'Design E ★' : 'Diseño E ★'}
          </Link>
        </div>
      </section>

      <section className="header-ejemplo-scroll">
        <p>
          {lang === 'en'
            ? 'Keep scrolling — the header stays fixed with a subtle shadow.'
            : 'Sigue bajando — el header se queda fijo con sombra sutil.'}
        </p>
      </section>

      <section className="header-ejemplo-scroll" style={{ background: '#fff' }}>
        <p>{lang === 'en' ? 'More content…' : 'Más contenido…'}</p>
      </section>
    </div>
  )
}
