import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getTourById } from '../data/toursData'
import { useLang } from '../context/LanguageContext'
import { useTourPrices } from '../context/TourPricesContext'

export default function TourDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLang()
  const td = t.tourDetail
  const prices = useTourPrices()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const tour = getTourById(id)

  if (!tour) {
    return (
      <div className="container py-5 text-center">
        <h2>{td.notFound}</h2>
        <button className="btn btn-success mt-3" onClick={() => navigate('/')}>
          {td.backHome}
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Hero de la pagina — solo imagen, nombre y duracion */}
      <div
        style={{
          background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('${tour.image}') center/cover no-repeat`,
          minHeight: '320px',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <div className="container pb-4 pt-5 mt-5 text-white">
          <h1 className="fw-bold mb-1">{tour.name}</h1>
          <p className="mb-0 fs-5" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <i className="bi bi-clock me-2" />
            {tour.subtitle}
          </p>
        </div>
      </div>

      {/* Barra: solo Volver */}
      <div className="border-bottom shadow-sm">
        <div className="container py-3">
          <button
            className="btn btn-outline-success fw-semibold"
            onClick={() => navigate('/')}
          >
            {td.back}
          </button>
        </div>
      </div>

      <div className="container py-5">
        {/* Descripcion + precio + boton reservar */}
        <div className="row g-4 mb-5">
          <div className="col-12">
            <p className="lead text-muted">{tour.description}</p>
            <div className="d-flex align-items-center gap-3 mt-3 flex-wrap">
              <Link
                to={`/reservar/${id}`}
                className="btn fw-bold px-4"
                style={{ backgroundColor: '#e67e22', color: '#fff', border: 'none' }}
              >
                {td.reserve}
              </Link>
              <span className="fs-5 fw-semibold" style={{ color: 'var(--green-primary)' }}>
                ${prices[tour.id] ?? tour.price} {td.perPerson}
              </span>
            </div>
          </div>
        </div>

        {/* Contenido pendiente */}
        {tour.pending && (
          <div className="alert alert-warning">
            <i className="bi bi-hourglass-split me-2" />
            El itinerario detallado de este tour estara disponible muy pronto.
            Contactanos por WhatsApp para mas informacion.
          </div>
        )}

        {/* Itinerario por dias */}
        {tour.days && tour.days.length > 0 && (
          <div className="mb-5">
            <h3 className="fw-bold mb-4" style={{ color: 'var(--green-primary)' }}>
              <i className="bi bi-map me-2" />
              {td.itinerary}
            </h3>
            <div className="row g-4">
              {tour.days.map(({ day, title, activities }) => (
                <div className="col-12" key={day}>
                  <div className="card border-0 shadow-sm">
                    <div
                      className="card-header fw-bold text-white"
                      style={{ backgroundColor: 'var(--green-primary)' }}
                    >
                      {td.day} {day} — {title}
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        {activities.map((act, i) => (
                          <li key={i} className="list-group-item px-0">
                            <i
                              className="bi bi-check-circle-fill me-2"
                              style={{ color: 'var(--green-light)' }}
                            />
                            {act}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Incluye / No incluye / Que llevar */}
        <div className="row g-4 mb-5">
          {/* Incluye */}
          {tour.includes.length > 0 && (
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header fw-bold text-white" style={{ backgroundColor: 'var(--green-primary)' }}>
                  <i className="bi bi-check2-circle me-2" />
                  {td.includes}
                </div>
                <ul className="list-group list-group-flush">
                  {tour.includes.map((item) => (
                    <li key={item} className="list-group-item">
                      <i className="bi bi-check-lg text-success me-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* No incluye */}
          {tour.notIncludes.length > 0 && (
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header fw-bold text-white bg-danger">
                  <i className="bi bi-x-circle me-2" />
                  {td.notIncludes}
                </div>
                <ul className="list-group list-group-flush">
                  {tour.notIncludes.map((item) => (
                    <li key={item} className="list-group-item">
                      <i className="bi bi-x-lg text-danger me-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Que llevar */}
          {tour.toBring.length > 0 && (
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header fw-bold text-white" style={{ backgroundColor: '#5a6268' }}>
                  <i className="bi bi-bag me-2" />
                  {td.toBring}
                </div>
                <ul className="list-group list-group-flush">
                  {tour.toBring.map((item) => (
                    <li key={item} className="list-group-item">
                      <i className="bi bi-bag-check me-2 text-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
