import { useLang } from '../context/LanguageContext'

export default function About() {
  const { t } = useLang()
  const features = t.about.features

  return (
    <section id="nosotros" className="about-section">
      <div className="container">
        {/* Título */}
        <div className="text-center mb-5">
          <h2 className="section-title">{t.about.sectionTitle}</h2>
          <div className="section-divider" />
        </div>

        <div className="row align-items-center gy-5">
          {/* Imágenes */}
          <div className="col-lg-6">
            <div className="row g-3">
              <div className="col-6">
                <img
                  src="/images/foto2.jpeg"
                  alt="Amazonia"
                  className="img-fluid rounded-3 shadow"
                  style={{ height: '220px', objectFit: 'cover', width: '100%' }}
                  loading="lazy"
                />
              </div>
              <div className="col-6">
                <img
                  src="/images/foto3.jpeg"
                  alt="Selva peruana"
                  className="img-fluid rounded-3 shadow"
                  style={{ height: '220px', objectFit: 'cover', width: '100%' }}
                  loading="lazy"
                />
              </div>
              <div className="col-12">
                <img
                  src="/images/foto4.jpeg"
                  alt="Rio Amazonas"
                  className="img-fluid rounded-3 shadow"
                  style={{ height: '250px', objectFit: 'cover', width: '100%' }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Texto */}
          <div className="col-lg-6 ps-lg-5">
            <h3 className="fw-bold mb-4" style={{ color: 'var(--green-primary)' }}>
              {t.about.heading}
            </h3>
            <p className="mb-3 text-muted fs-5">{t.about.p1}</p>
            <p className="mb-4 text-muted">{t.about.p2}</p>

            {/* Features */}
            <div className="row g-3">
              {features.map(({ icon, title, desc }) => (
                <div className="col-sm-6" key={title}>
                  <div className="d-flex align-items-start gap-2">
                    <i
                      className={`bi ${icon} fs-4 flex-shrink-0`}
                      style={{ color: 'var(--green-primary)' }}
                    />
                    <div>
                      <h6 className="fw-bold mb-1">{title}</h6>
                      <p className="text-muted small mb-0">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
