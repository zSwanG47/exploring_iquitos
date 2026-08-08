import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import NavbarEjemplo2 from '../components/NavbarEjemplo2'

export default function HeaderEjemplo2Page() {
  const { lang } = useLang()

  return (
    <>
      <NavbarEjemplo2 />
      <div className="header-ejemplo2-page">
        <section className="header-ejemplo2-hero">
          <div>
            <p className="header-ejemplo2-banner">
              <i className="bi bi-compass" />
              {lang === 'en' ? 'Design B — Amazon expedition' : 'Diseño B — Expedición amazónica'}
            </p>
            <h1>Exploring Iquitos</h1>
            <p>
              {lang === 'en'
                ? 'Parchment bar, journal-style numbered sections, Iquitos coordinates, river wave edge and a map-style mobile drawer — built for this brand, not a template.'
                : 'Barra pergamino, secciones numeradas estilo diario de expedición, coordenadas de Iquitos, borde ondulado de río y menú móvil tipo mapa — hecho para esta marca, no una plantilla.'}
            </p>
          <div className="header-ejemplo2-links">
            <Link to="/" className="btn btn-outline-light px-4 py-2 fw-semibold">
              {lang === 'en' ? 'Current site' : 'Sitio actual'}
            </Link>
            <Link to="/ejemplo-header" className="btn btn-outline-warning px-4 py-2 fw-semibold">
              A
            </Link>
            <Link to="/ejemplo-header-3" className="btn btn-outline-warning px-4 py-2 fw-semibold">
              C
            </Link>
          </div>
          </div>
        </section>

        <section className="header-ejemplo2-scroll">
          <p>
            {lang === 'en'
              ? 'Scroll down — the top ribbon hides and the header compacts while the river wave stays.'
              : 'Baja — la cinta superior se oculta y el header se compacta, pero la ola del río se mantiene.'}
          </p>
        </section>

        <section className="header-ejemplo2-scroll" style={{ background: '#fff' }}>
          <p>{lang === 'en' ? 'More content below…' : 'Más contenido abajo…'}</p>
        </section>
      </div>
    </>
  )
}
