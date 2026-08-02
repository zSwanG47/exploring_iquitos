import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getTourById, getLocalizedTour } from '../data/toursData'
import { useLang } from '../context/LanguageContext'
import { useTourPrice } from '../context/TourPricesContext'
import TourPriceDisplay from '../components/TourPriceDisplay'
import AppNotice from '../components/AppNotice'
import '../styles/tour-detail.css'

const WA_NUMBER = '51925998156'

export default function TourDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useLang()
  const td = t.tourDetail
  const { price, loading: priceLoading } = useTourPrice(id)
  const [openDay, setOpenDay] = useState(1)
  const tour = getLocalizedTour(getTourById(id), lang)

  useEffect(() => {
    window.scrollTo(0, 0)
    setOpenDay(1)
  }, [id])

  useEffect(() => {
    if (tour) {
      document.title = `${tour.name} | Exploring Iquitos`
    }
    return () => {
      document.title = 'Exploring Iquitos | Tours en la Amazonia Peruana'
    }
  }, [tour])

  if (!tour) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <h2>{td.notFound}</h2>
        <button className="btn btn-success mt-3" onClick={() => navigate('/')}>
          {td.backHome}
        </button>
      </div>
    )
  }

  const waMsg = encodeURIComponent(
    price != null
      ? `Hola, me interesa el ${tour.name} (${tour.subtitle}) por $${price} USD.`
      : `Hola, me interesa el ${tour.name} (${tour.subtitle}).`
  )

  return (
    <div className="tour-detail">
      <header className="tour-detail__hero">
        <div
          className="tour-detail__hero-bg"
          style={{ backgroundImage: `url('${tour.image}')` }}
        />
        <div className="tour-detail__hero-overlay" />
        <div className="container tour-detail__hero-content">
          <h1 className="tour-detail__title">{tour.name}</h1>

          <div className="tour-detail__meta">
            <span className="tour-detail__pill tour-detail__pill--duration">
              <i className="bi bi-clock" />
              {tour.subtitle}
            </span>
            <span className="tour-detail__pill tour-detail__pill--price">
              <i className="bi bi-tag-fill" />
              <TourPriceDisplay price={price} loading={priceLoading} />
              {!priceLoading && price != null && ` ${td.perPerson}`}
            </span>
          </div>
        </div>
      </header>

      <div className="container tour-detail__body">
        <div className="row g-5">
          <div className="col-lg-8">
            <Link to="/tours" className="tour-detail__back-link">
              <i className="bi bi-arrow-left" />
              {td.backToTours}
            </Link>

            <div className="tour-detail__intro">
              <p>{tour.description}</p>
            </div>

            {tour.highlights?.length > 0 && (
              <section className="tour-detail__highlights">
                <div className="tour-detail__section-label">{td.highlights}</div>
                <div className="tour-detail__highlights-grid">
                  {tour.highlights.map(({ icon, label }) => (
                    <span key={label} className="tour-detail__highlight-chip">
                      <i className={`bi ${icon}`} />
                      {label}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {tour.pending && (
              <AppNotice variant="warning" icon="bi-hourglass-split" className="mb-4">
                {td.pending}
              </AppNotice>
            )}

            {tour.days?.length > 0 && (
              <section className="tour-detail__itinerary">
                <h2 className="tour-detail__itinerary-title">
                  <i className="bi bi-signpost-split" />
                  {td.itinerary}
                </h2>

                <div className="tour-detail__timeline">
                  {tour.days.map(({ day, title, activities }) => {
                    const isOpen = openDay === day
                    return (
                      <div
                        key={day}
                        className={`tour-detail__day${isOpen ? ' tour-detail__day--open' : ''}`}
                      >
                        <button
                          type="button"
                          className="tour-detail__day-btn"
                          onClick={() => setOpenDay(isOpen ? null : day)}
                          aria-expanded={isOpen}
                        >
                          <span className="tour-detail__day-num">{day}</span>
                          <span className="tour-detail__day-info">
                            <span className="tour-detail__day-label">
                              {td.day} {day}
                            </span>
                            <span className="tour-detail__day-title">{title}</span>
                          </span>
                          <i className="bi bi-chevron-down tour-detail__day-chevron" />
                        </button>
                        <div className="tour-detail__day-body">
                          <ul className="tour-detail__day-activities">
                            {activities.map((act, i) => (
                              <li key={i}>{act}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            <div className="tour-detail__info-grid">
              {tour.includes.length > 0 && (
                <div className="tour-detail__info-panel tour-detail__info-panel--includes">
                  <h4>
                    <i className="bi bi-check2-circle" />
                    {td.includes}
                  </h4>
                  <ul>
                    {tour.includes.map((item) => (
                      <li key={item}>
                        <i className="bi bi-check-lg text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.notIncludes.length > 0 && (
                <div className="tour-detail__info-panel tour-detail__info-panel--excludes">
                  <h4>
                    <i className="bi bi-x-circle" />
                    {td.notIncludes}
                  </h4>
                  <ul>
                    {tour.notIncludes.map((item) => (
                      <li key={item}>
                        <i className="bi bi-x-lg text-danger" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.toBring.length > 0 && (
                <div className="tour-detail__info-panel tour-detail__info-panel--bring">
                  <h4>
                    <i className="bi bi-backpack" />
                    {td.toBring}
                  </h4>
                  <ul>
                    {tour.toBring.map((item) => (
                      <li key={item}>
                        <i className="bi bi-dot text-secondary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>

          <div className="col-lg-4 d-none d-lg-block">
            <aside className="tour-detail__aside">
              <div className="tour-detail__book-card">
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="tour-detail__book-card-img"
                />
                <div className="tour-detail__book-card-body">
                  <div className="tour-detail__book-price">
                    <TourPriceDisplay price={price} loading={priceLoading} />
                    {!priceLoading && price != null && <small>{td.perPerson}</small>}
                  </div>

                  <ul className="tour-detail__book-includes">
                    {tour.includes.slice(0, 4).map((item) => (
                      <li key={item}>
                        <i className="bi bi-check-circle-fill" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/reservar/${id}`}
                    className="tour-detail__btn-reserve"
                    style={price == null && !priceLoading ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
                    aria-disabled={price == null && !priceLoading}
                  >
                    <i className="bi bi-calendar-check me-2" />
                    {td.reserve}
                  </Link>

                  <a
                    href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tour-detail__btn-wa"
                  >
                    <i className="bi bi-whatsapp" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="tour-detail__mobile-bar">
        <div className="tour-detail__mobile-bar-price">
          <TourPriceDisplay price={price} loading={priceLoading} />
          {!priceLoading && price != null && <span>{td.perPerson}</span>}
        </div>
        <Link
          to={`/reservar/${id}`}
          className="tour-detail__btn-reserve"
          style={price == null && !priceLoading ? { pointerEvents: 'none', opacity: 0.5 } : undefined}
        >
          {td.reserve}
        </Link>
      </div>
    </div>
  )
}
