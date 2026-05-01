import { Link } from 'react-router-dom'
import { tours, getLocalizedTour } from '../data/toursData'
import { useLang } from '../context/LanguageContext'
import { useTourPrices } from '../context/TourPricesContext'

function TourCard({ tour, t, price, lang }) {
  tour = getLocalizedTour(tour, lang)
  return (
    <div className="col-md-6 col-xl-4 d-flex">
      <div className="tour-card card w-100">
        <img src={tour.image} alt={tour.name} loading="lazy" />
        <div className="card-body d-flex flex-column p-4">
          <h5 className="card-title fw-bold mb-1">{tour.name}</h5>
          <p className="text-muted small mb-2">
            <i className="bi bi-clock me-1" />
            {tour.subtitle}
          </p>
          <p className="card-text text-muted small mb-3 flex-grow-1">{tour.description}</p>

          <div className="mb-3">
            {tour.includes.map((item) => (
              <span
                key={item}
                className="badge rounded-pill me-1 mb-1"
                style={{ backgroundColor: '#d4edda', color: '#145228' }}
              >
                <i className="bi bi-check2 me-1" />
                {item}
              </span>
            ))}
          </div>

          <div className="mb-3">
            <span className="tour-price">${price ?? tour.price}</span>
            <span className="text-muted small ms-1">{t.tours.perPerson}</span>
          </div>

          <div className="d-flex gap-2">
            <Link
              to={`/tour/${tour.id}`}
              className="btn btn-outline-success fw-semibold flex-fill"
            >
              <i className="bi bi-file-text me-1" />
              {t.tours.btnDetails}
            </Link>
            <Link
              to={`/reservar/${tour.id}`}
              className="btn btn-success fw-semibold flex-fill"
            >
              {t.tours.btnReserve}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Tours() {
  const { t, lang } = useLang()
  const prices = useTourPrices()
  return (
    <section id="tours" className="py-5 bg-white">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">{t.tours.sectionTitle}</h2>
          <div className="section-divider" />
          <p className="text-muted fs-5 mt-4">
            {t.tours.subtitle}
          </p>
        </div>
        <div className="row g-4 justify-content-center">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} t={t} price={prices[tour.id] ?? tour.price} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  )
}
