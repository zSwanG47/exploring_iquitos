import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { galleryPhotos } from '../data/galleryPhotos'
import '../styles/gallery-carousel.css'

const AUTO_MS = 4500

function MarqueeRow({ photos, reverse = false }) {
  const loop = [...photos, ...photos]

  return (
    <div className={`gallery-v2__marquee-wrap${reverse ? ' gallery-v2__marquee-wrap--reverse' : ''}`}>
      <div className="gallery-v2__marquee-track">
        {loop.map((src, i) => (
          <div className="gallery-v2__marquee-item" key={`${src}-${i}`}>
            <img src={src} alt="" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GalleryEjemplo() {
  const { t, lang } = useLang()
  const tg = t.gallery
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = galleryPhotos.length

  const goTo = useCallback((next) => {
    setIndex((i) => (next + total) % total)
  }, [total])

  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % total)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [paused, total])

  const half = Math.ceil(total / 2)
  const photoAlt = lang === 'en'
    ? 'Exploring Iquitos — Amazon gallery'
    : 'Exploring Iquitos — Galería Amazonía'

  return (
    <section className="gallery-v2">
      <div className="container">
        <header className="gallery-v2__header">
          <p className="gallery-v2__eyebrow">Exploring Iquitos</p>
          <h1 className="gallery-v2__title">{tg.sectionTitle}</h1>
          <p className="gallery-v2__subtitle">{tg.subtitle}</p>
        </header>

        <div className="gallery-v2__demo-banner">
          <i className="bi bi-palette-fill" aria-hidden="true" />
          {lang === 'en'
            ? `Design preview — ${total} photos with auto carousel + scrolling strip`
            : `Vista de ejemplo — ${total} fotos con carrusel automático y cinta deslizante`}
        </div>

        <div
          className="gallery-v2__carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="gallery-v2__carousel-viewport">
            {galleryPhotos.map((src, i) => (
              <div
                key={src}
                className={`gallery-v2__slide${i === index ? ' gallery-v2__slide--active' : ''}`}
                aria-hidden={i !== index}
              >
                <img src={src} alt={photoAlt} />
                <div className="gallery-v2__slide-overlay" />
              </div>
            ))}
            <span className="gallery-v2__counter">
              {index + 1} / {total}
            </span>
            <button
              type="button"
              className="gallery-v2__nav gallery-v2__nav--prev"
              onClick={() => goTo(index - 1)}
              aria-label={lang === 'en' ? 'Previous photo' : 'Foto anterior'}
            >
              <i className="bi bi-chevron-left" />
            </button>
            <button
              type="button"
              className="gallery-v2__nav gallery-v2__nav--next"
              onClick={() => goTo(index + 1)}
              aria-label={lang === 'en' ? 'Next photo' : 'Siguiente foto'}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>

          <div className="gallery-v2__progress" aria-hidden="true">
            <div
              className="gallery-v2__progress-bar"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <p className="gallery-v2__marquee-label">
          {lang === 'en' ? 'All moments — continuous scroll' : 'Todos los momentos — desplazamiento continuo'}
        </p>
        <MarqueeRow photos={galleryPhotos.slice(0, half)} />
        <MarqueeRow photos={galleryPhotos.slice(half)} reverse />

        <div className="text-center mt-5 d-flex flex-wrap justify-content-center gap-3">
          <Link to="/ejemplo-galeria-2" className="btn btn-outline-success px-4 py-2 fw-semibold">
            <i className="bi bi-box-seam me-2" />
            {lang === 'en' ? 'Preview B (3D coverflow)' : 'Prueba B (carrusel 3D)'}
          </Link>
          <Link to="/galeria" className="btn btn-success px-4 py-2 fw-semibold">
            <i className="bi bi-arrow-left me-2" />
            {lang === 'en' ? 'View current gallery' : 'Ver galería actual'}
          </Link>
        </div>
      </div>
    </section>
  )
}
