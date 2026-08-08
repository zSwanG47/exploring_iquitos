import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import NavbarEjemplo3 from '../components/NavbarEjemplo3'

export default function HeaderEjemplo3Page() {
  const { lang } = useLang()

  return (
    <>
      <NavbarEjemplo3 />
      <div className="header-ejemplo3-page">
        <section className="header-ejemplo3-hero">
          <div>
            <p className="header-ejemplo3-tag">
              {lang === 'en' ? 'Design C — River horizon' : 'Diseño C — Horizonte del río'}
            </p>
            <h1>Exploring Iquitos</h1>
            <p>
              {lang === 'en'
                ? 'Invisible over the photo at the top. On scroll it fills with night green and a sunset stripe — uppercase nav, ES/EN toggle, no pills or ribbons.'
                : 'Invisible sobre la foto arriba. Al bajar se llena de verde noche y una franja de atardecer — nav en mayúsculas, toggle ES/EN, sin pills ni cintas.'}
            </p>
            <div className="header-ejemplo3-links">
              <Link to="/" className="btn btn-outline-light px-4 py-2 fw-semibold">
                {lang === 'en' ? 'Current site' : 'Sitio actual'}
              </Link>
              <Link to="/ejemplo-header" className="btn btn-outline-warning px-4 py-2 fw-semibold">
                A
              </Link>
              <Link to="/ejemplo-header-2" className="btn btn-outline-warning px-4 py-2 fw-semibold">
                B
              </Link>
            </div>
          </div>
        </section>

        <section className="header-ejemplo3-scroll">
          <p>
            {lang === 'en'
              ? 'Scroll triggered the solid bar — sunset line under the header, logo slightly smaller.'
              : 'El scroll activó la barra sólida — línea de atardecer bajo el header, logo un poco más pequeño.'}
          </p>
        </section>

        <section className="header-ejemplo3-scroll" style={{ background: '#fff' }}>
          <p>{lang === 'en' ? 'Keep going…' : 'Sigue bajando…'}</p>
        </section>
      </div>
    </>
  )
}
