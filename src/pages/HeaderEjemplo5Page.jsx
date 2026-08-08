import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import NavbarEjemplo5 from '../components/NavbarEjemplo5'

export default function HeaderEjemplo5Page() {
  const { lang } = useLang()

  const sources = lang === 'en'
    ? [
        { title: 'Baymard / AtlasPerk', body: '76% of large travel & e-commerce sites use mega menus to expose tour categories without extra clicks.' },
        { title: 'NN/G hybrid mobile', body: '3 key links visible (Home, Tours, Contact) + drawer for the rest — faster than hamburger-only.' },
        { title: 'EasyJet / sticky pattern', body: 'White sticky bar that compacts on scroll; primary CTA always visible on the right.' },
      ]
    : [
        { title: 'Baymard / AtlasPerk', body: 'El 76% de sitios travel y e-commerce grandes usa mega menús para mostrar tours sin clics extra.' },
        { title: 'NN/G híbrido móvil', body: '3 links visibles (Inicio, Tours, Contacto) + drawer para el resto — más rápido que solo hamburguesa.' },
        { title: 'EasyJet / sticky', body: 'Barra blanca sticky que se compacta al scroll; CTA principal siempre visible a la derecha.' },
      ]

  return (
    <>
      <NavbarEjemplo5 />
      <div className="header-ejemplo5-page">
        <section className="header-ejemplo5-hero">
          <div className="container">
            <span className="header-ejemplo5-tag">
              {lang === 'en' ? 'Design E — Research-based' : 'Diseño E — Basado en investigación'}
            </span>
            <h1>
              {lang === 'en'
                ? 'The header pattern travel sites actually use'
                : 'El patrón de header que sí usan los sitios de turismo'}
            </h1>
            <p>
              {lang === 'en'
                ? 'On desktop, click Tours to open a mega menu with your real packages. On mobile, hybrid nav + side drawer. White bar, green CTA — like Booking, Expedia and modern tour operators.'
                : 'En desktop, clic en Tours abre mega menú con tus paquetes reales. En móvil, nav híbrido + drawer lateral. Barra blanca, CTA verde — como Booking, Expedia y operadores modernos.'}
            </p>

            <div className="header-ejemplo5-sources">
              {sources.map(({ title, body }) => (
                <article key={title} className="header-ejemplo5-source">
                  <strong>{title}</strong>
                  <p>{body}</p>
                </article>
              ))}
            </div>

            <div className="header-ejemplo5-links">
              <Link to="/" className="btn btn-success btn-sm px-3 fw-semibold">
                {lang === 'en' ? 'Current site' : 'Sitio actual'}
              </Link>
              <Link to="/ejemplo-header" className="btn btn-outline-secondary btn-sm px-3">A</Link>
              <Link to="/ejemplo-header-2" className="btn btn-outline-secondary btn-sm px-3">B</Link>
              <Link to="/ejemplo-header-3" className="btn btn-outline-secondary btn-sm px-3">C</Link>
              <Link to="/ejemplo-header-4" className="btn btn-outline-secondary btn-sm px-3">D</Link>
            </div>
          </div>
        </section>

        <section className="header-ejemplo5-preview">
          <div>
            <h2>{lang === 'en' ? 'Try it' : 'Pruébalo'}</h2>
            <p>
              {lang === 'en'
                ? 'Desktop: click Tours in the header. Mobile: open the side menu or tap Tours.'
                : 'Desktop: haz clic en Tours en el header. Móvil: abre el menú lateral o toca Tours.'}
            </p>
          </div>
        </section>

        <section className="header-ejemplo5-scroll">
          <p>
            {lang === 'en'
              ? 'Scroll to see the compact sticky header — the pattern used by airlines and OTAs.'
              : 'Haz scroll para ver el header sticky compacto — el patrón de aerolíneas y OTAs.'}
          </p>
        </section>
      </div>
    </>
  )
}
