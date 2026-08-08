import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { galleryPhotos } from '../data/galleryPhotos'
import '../styles/gallery-coverflow.css'

const AUTO_MS = 3500
const VISIBLE = 4

function relativeOffset(i, active, total) {
  let d = i - active
  while (d > total / 2) d -= total
  while (d < -total / 2) d += total
  return d
}

function cardTransform(offset) {
  const abs = Math.abs(offset)
  const rotateY = offset * -42
  const translateX = offset * 155
  const translateZ = abs === 0 ? 80 : -abs * 90
  const scale = abs === 0 ? 1 : Math.max(0.55, 0.88 - abs * 0.1)
  const opacity = abs > VISIBLE ? 0 : Math.max(0.2, 1 - abs * 0.22)
  const zIndex = 20 - abs
  return {
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity,
    zIndex,
  }
}

export default function GalleryEjemplo2() {
  const { t, lang } = useLang()
  const tg = t.gallery
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [lightbox, setLightbox] = useState(null)
  const total = galleryPhotos.length
  const photoAlt = lang === 'en'
    ? 'Exploring Iquitos — Amazon gallery'
    : 'Exploring Iquitos — Galería Amazonía'

  const goTo = useCallback((n) => {
    setIndex((n + total) % total)
  }, [total])

  useEffect(() => {
    if (!playing || lightbox != null) return undefined
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % total)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [playing, lightbox, total])

  useEffect(() => {
    if (lightbox == null) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') setLightbox((i) => (i - 1 + total) % total)
      if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % total)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, total])

  const openLightbox = (i) => {
    setPlaying(false)
    setLightbox(i)
  }

  return (
    <div className="gallery-v3">
      <section className="gallery-v3__hero">
        <div className="container">
          <header className="gallery-v3__header">
            <span className="gallery-v3__badge">
              <i className="bi bi-stars" aria-hidden="true" />
              {lang === 'en' ? 'Concept B' : 'Concepto B'}
            </span>
            <h1 className="gallery-v3__title">{tg.sectionTitle}</h1>
            <p className="gallery-v3__subtitle">{tg.subtitle}</p>
          </header>

          <p className="gallery-v3__demo">
            <i className="bi bi-lightning-charge-fill me-1" aria-hidden="true" />
            {lang === 'en'
              ? '3D coverflow carousel + polaroid wall with lightbox — second preview'
              : 'Carrusel 3D coverflow + muro polaroid con lightbox — segunda prueba'}
          </p>

          <div className="gallery-v3__stage" aria-live="polite">
            <div className="gallery-v3__ring">
              {galleryPhotos.map((src, i) => {
                const offset = relativeOffset(i, index, total)
                if (Math.abs(offset) > VISIBLE) return null
                const style = cardTransform(offset)
                const isCenter = offset === 0
                return (
                  <div
                    key={src}
                    className={`gallery-v3__card${isCenter ? ' gallery-v3__card--center' : ''}`}
                    style={style}
                    onClick={() => (isCenter ? openLightbox(i) : goTo(i))}
                    role="button"
                    tabIndex={isCenter ? 0 : -1}
                    aria-label={photoAlt}
                    onKeyDown={(e) => e.key === 'Enter' && (isCenter ? openLightbox(i) : goTo(i))}
                  >
                    <img src={src} alt={photoAlt} draggable={false} />
                    <div className="gallery-v3__card-glow" />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="gallery-v3__controls">
            <button
              type="button"
              className="gallery-v3__ctrl"
              onClick={() => goTo(index - 1)}
              aria-label={lang === 'en' ? 'Previous' : 'Anterior'}
            >
              <i className="bi bi-chevron-left" />
            </button>
            <button
              type="button"
              className="gallery-v3__ctrl"
              onClick={() => goTo(index + 1)}
              aria-label={lang === 'en' ? 'Next' : 'Siguiente'}
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>

          <div className="gallery-v3__meta">
            <span>{index + 1} / {total}</span>
            <br />
            <button
              type="button"
              className="gallery-v3__play-toggle"
              onClick={() => setPlaying((p) => !p)}
            >
              <i className={`bi bi-${playing ? 'pause' : 'play'}-fill`} />
              {playing
                ? (lang === 'en' ? 'Pause rotation' : 'Pausar giro')
                : (lang === 'en' ? 'Auto rotate' : 'Giro automático')}
            </button>
          </div>
        </div>
      </section>

      <section className="gallery-v3__wall">
        <div className="container">
          <div className="gallery-v3__wall-head">
            <h2>{lang === 'en' ? 'Memory wall' : 'Muro de recuerdos'}</h2>
            <p>{lang === 'en' ? 'Tap any polaroid to enlarge' : 'Toca cualquier polaroid para ampliar'}</p>
          </div>

          <div className="gallery-v3__polaroids">
            {galleryPhotos.map((src, i) => (
              <button
                key={src}
                type="button"
                className="gallery-v3__polaroid"
                onClick={() => openLightbox(i)}
                aria-label={photoAlt}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>

          <div className="gallery-v3__links">
            <Link to="/ejemplo-galeria" className="gallery-v3__link-btn gallery-v3__link-btn--outline">
              <i className="bi bi-collection-play" />
              {lang === 'en' ? 'Preview A (marquee)' : 'Prueba A (marquee)'}
            </Link>
            <Link to="/galeria" className="gallery-v3__link-btn gallery-v3__link-btn--green">
              <i className="bi bi-images" />
              {lang === 'en' ? 'Current gallery' : 'Galería actual'}
            </Link>
          </div>
        </div>
      </section>

      {lightbox != null && (
        <div
          className="gallery-v3__lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="gallery-v3__lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label={lang === 'en' ? 'Close' : 'Cerrar'}
          >
            <i className="bi bi-x-lg" />
          </button>
          <button
            type="button"
            className="gallery-v3__lightbox-nav gallery-v3__lightbox-nav--prev"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i - 1 + total) % total) }}
            aria-label={lang === 'en' ? 'Previous' : 'Anterior'}
          >
            <i className="bi bi-chevron-left" />
          </button>
          <img
            src={galleryPhotos[lightbox]}
            alt={photoAlt}
            className="gallery-v3__lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="gallery-v3__lightbox-nav gallery-v3__lightbox-nav--next"
            onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i + 1) % total) }}
            aria-label={lang === 'en' ? 'Next' : 'Siguiente'}
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      )}
    </div>
  )
}
