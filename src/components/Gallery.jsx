import { useLang } from '../context/LanguageContext'

// foto5 → foto23 = 19 fotos para la galeria
// foto1 usada en hero, foto2-foto4 en la seccion nosotros
const photos = Array.from({ length: 19 }, (_, i) => `/images/foto${i + 5}.jpeg`)

export default function Gallery() {
  const { t } = useLang()
  return (
    <section id="galeria" className="gallery-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">{t.gallery.sectionTitle}</h2>
          <div className="section-divider" />
          <p className="text-muted fs-5 mt-4">
            {t.gallery.subtitle}
          </p>
        </div>

        <div className="row g-3">
          {photos.map((src, i) => (
            <div className="col-6 col-md-4 col-lg-3" key={i}>
              <img
                src={src}
                alt={`Amazonia ${i + 5}`}
                className="gallery-img"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
