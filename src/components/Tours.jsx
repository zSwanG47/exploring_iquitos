import { Link } from 'react-router-dom'
import { tours, getLocalizedTour } from '../data/toursData'
import { useLang } from '../context/LanguageContext'
import { useTourPrices } from '../context/TourPricesContext'
import TourPriceDisplay from './TourPriceDisplay'
import '../styles/tours-cards.css'

function TourCard({ tour, t, price, priceLoading, lang }) {
  const localized = getLocalizedTour(tour, lang)
  const visibleIncludes = localized.includes.slice(0, 3)
  const extraCount = localized.includes.length - visibleIncludes.length
  const canBook = !priceLoading && price != null

  return (
    <article className="tour-card-v2 w-100">
      <div className="tour-card-v2__media">
        <img src={localized.image} alt={localized.name} loading="lazy" />
        <div className="tour-card-v2__media-overlay" />
        <span className="tour-card-v2__duration">
          <i className="bi bi-clock" />
          {localized.subtitle}
        </span>
        <h3 className="tour-card-v2__name-overlay">{localized.name}</h3>
      </div>

      <div className="tour-card-v2__body">
        <p className="tour-card-v2__desc">{localized.description}</p>

        <ul className="tour-card-v2__includes">
          {visibleIncludes.map((item) => (
            <li key={item}>
              <i className="bi bi-check-circle-fill" />
              {item}
            </li>
          ))}
          {extraCount > 0 && (
            <li className="tour-card-v2__includes-more">
              +{extraCount} {lang === 'en' ? 'more included' : 'mas incluido'}
            </li>
          )}
        </ul>

        <div className="tour-card-v2__footer">
          <div className="tour-card-v2__price-row">
            <TourPriceDisplay price={price} loading={priceLoading} className="tour-card-v2__price" />
            {!priceLoading && price != null && (
              <span className="tour-card-v2__price-unit">{t.tours.perPerson}</span>
            )}
          </div>

          <div className="tour-card-v2__actions">
            <Link
              to={`/tour/${localized.id}`}
              className="tour-card-v2__btn tour-card-v2__btn--outline"
            >
              <i className="bi bi-compass" />
              {t.tours.btnDetails}
            </Link>
            <Link
              to={`/reservar/${localized.id}`}
              className={`tour-card-v2__btn tour-card-v2__btn--primary${canBook ? '' : ' tour-card-v2__btn--disabled'}`}
              aria-disabled={!canBook}
            >
              <i className="bi bi-calendar-check" />
              {t.tours.btnReserve}
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Tours() {
  const { t, lang } = useLang()
  const { prices, loading } = useTourPrices()

  return (
    <section id="tours" className="tours-v2">
      <div className="container">
        <header className="tours-v2__header">
          <p className="tours-v2__eyebrow">Exploring Iquitos</p>
          <h2 className="tours-v2__title">{t.tours.sectionTitle}</h2>
          <p className="tours-v2__subtitle">{t.tours.subtitle}</p>
        </header>

        <div className="row g-4 justify-content-center">
          {tours.map((tour) => (
            <div key={tour.id} className="col-md-6 col-xl-4 d-flex">
              <TourCard
                tour={tour}
                t={t}
                price={prices[tour.id]}
                priceLoading={loading}
                lang={lang}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
