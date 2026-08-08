import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import NavbarEjemplo4 from '../components/NavbarEjemplo4'

const UX_CARDS = {
  es: [
    {
      title: 'Sin menú hamburguesa en móvil',
      body: 'Las 5 secciones van en una tira deslizable. Un turista ve todo de un vistazo y llega con un toque — no hay que adivinar qué hay dentro del menú.',
    },
    {
      title: 'WhatsApp y teléfono visibles',
      body: 'Arriba el número con enlace directo; a la derecha el botón verde. En turismo local la conversación cierra reservas más que un CTA genérico de “Reservar”.',
    },
    {
      title: 'Tours como acción principal',
      body: 'En desktop es el único ítem con fondo blanco. En móvil destaca en la tira. Es la página que más interesa sin usar gradientes ni badges decorativos.',
    },
    {
      title: 'Idioma en un clic',
      body: 'ES / EN como texto, sin dropdown. Menos fricción para quien cambia de idioma rápido en el aeropuerto o en el hotel.',
    },
    {
      title: 'Colores de tu marca',
      body: 'Verde #1d7a3d y #145228 del sitio actual. Panel lateral un tono más claro para jerarquía — sin glass, sin serif de plantilla, sin coordenadas GPS.',
    },
    {
      title: 'Se compacta al scroll',
      body: 'La franja de contacto se oculta y queda lo esencial fijo. Más espacio para contenido sin perder navegación.',
    },
  ],
  en: [
    {
      title: 'No hamburger on mobile',
      body: 'All 5 sections sit in a horizontal scroll strip. Tourists see everything at once and tap once — no guessing what hides behind a menu icon.',
    },
    {
      title: 'WhatsApp and phone upfront',
      body: 'Number linked at the top; green button on the right. For local tourism, chat closes bookings faster than a generic “Book now” pill.',
    },
    {
      title: 'Tours as the main action',
      body: 'On desktop it’s the only white-filled item. On mobile it stands out in the tab strip. Highlights what matters without gradient decoration.',
    },
    {
      title: 'Language in one tap',
      body: 'ES / EN as plain text, no dropdown. Less friction for someone switching language at the airport or hotel.',
    },
    {
      title: 'Your brand colors',
      body: 'Same #1d7a3d and #145228 as the live site. A slightly lighter side panel for hierarchy — no glass, no template serif, no GPS coordinates.',
    },
    {
      title: 'Compacts on scroll',
      body: 'The contact strip hides and essentials stay fixed. More room for content without losing navigation.',
    },
  ],
}

export default function HeaderEjemplo4Page() {
  const { lang } = useLang()
  const cards = UX_CARDS[lang] ?? UX_CARDS.es

  return (
    <>
      <NavbarEjemplo4 />
      <div className="header-ejemplo4-page">
        <section className="header-ejemplo4-intro">
          <div className="container">
            <span className="header-ejemplo4-tag">
              {lang === 'en' ? 'Design D — UX-first' : 'Diseño D — UX primero'}
            </span>
            <h1>
              {lang === 'en'
                ? 'Header built for how people actually book tours'
                : 'Header pensado para cómo la gente reserva tours de verdad'}
            </h1>
            <p>
              {lang === 'en'
                ? 'Less “landing page template”, more utility: visible contact, thumb-friendly mobile nav, and one clear priority — Tours.'
                : 'Menos plantilla de landing, más utilidad: contacto visible, nav móvil cómodo con el pulgar y una prioridad clara — Tours.'}
            </p>

            <div className="header-ejemplo4-ux">
              {cards.map(({ title, body }) => (
                <article key={title} className="header-ejemplo4-card">
                  <strong>{title}</strong>
                  <p>{body}</p>
                </article>
              ))}
            </div>

            <div className="header-ejemplo4-links">
              <Link to="/" className="btn btn-success btn-sm px-3 fw-semibold">
                {lang === 'en' ? 'Current site' : 'Sitio actual'}
              </Link>
              <Link to="/ejemplo-header" className="btn btn-outline-secondary btn-sm px-3">A</Link>
              <Link to="/ejemplo-header-2" className="btn btn-outline-secondary btn-sm px-3">B</Link>
              <Link to="/ejemplo-header-3" className="btn btn-outline-secondary btn-sm px-3">C</Link>
            </div>
          </div>
        </section>

        <section className="header-ejemplo4-preview">
          <div>
            <h2>Exploring Iquitos</h2>
            <p>
              {lang === 'en'
                ? 'On mobile, try swiping the section strip below the header.'
                : 'En móvil, prueba deslizar la tira de secciones bajo el header.'}
            </p>
          </div>
        </section>

        <section className="header-ejemplo4-scroll">
          <p>
            {lang === 'en'
              ? 'Scroll up — the contact strip reappears. The header never blocks the main action paths.'
              : 'Sube otra vez — vuelve la franja de contacto. El header no bloquea las rutas principales.'}
          </p>
        </section>
      </div>
    </>
  )
}
