import { useState, useEffect, useCallback } from 'react'
import { useLang } from '../context/LanguageContext'
import { galleryPhotos } from '../data/galleryPhotos'
import '../styles/gallery-carousel.css'

const AUTO_MS = 4500

export default function Gallery() {
  const { t, lang } = useLang()
  const tg = t.gallery
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const total = galleryPhotos.length
  const gridPhotos = galleryPhotos

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

  useEffect(() => {
    if (lightboxIndex === null) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) => (i - 1 + gridPhotos.length) % gridPhotos.length)
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((i) => (i + 1) % gridPhotos.length)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [lightboxIndex, gridPhotos.length])

  const photoAlt = lang === 'en'
    ? 'Exploring Iquitos — Amazon gallery'
    : 'Exploring Iquitos — Galería Amazonía'

  return (
    <section id="galeria" className="gallery-v2">
      <div className="container">
        <header className="gallery-v2__header">
          <p className="gallery-v2__eyebrow">Exploring Iquitos</p>
          <h2 className="gallery-v2__title">{tg.sectionTitle}</h2>
          <p className="gallery-v2__subtitle">{tg.subtitle}</p>
        </header>

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

        <div className="gallery-v2__grid">
          {gridPhotos.map((src, i) => (
            <button
              type="button"
              className="gallery-v2__grid-item"
              key={src}
              onClick={() => setLightboxIndex(i)}
              aria-label={lang === 'en' ? `Open photo ${i + 1}` : `Abrir foto ${i + 1}`}
            >
              <img src={src} alt={`${photoAlt} ${i + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="gallery-v2__lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'en' ? 'Photo viewer' : 'Visor de fotos'}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="gallery-v2__lightbox-close"
            onClick={() => setLightboxIndex(null)}
            aria-label={lang === 'en' ? 'Close' : 'Cerrar'}
          >
            <i className="bi bi-x-lg" />
          </button>
          <button
            type="button"
            className="gallery-v2__lightbox-nav gallery-v2__lightbox-nav--prev"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((i) => (i - 1 + gridPhotos.length) % gridPhotos.length)
            }}
            aria-label={lang === 'en' ? 'Previous photo' : 'Foto anterior'}
          >
            <i className="bi bi-chevron-left" />
          </button>
          <img
            src={gridPhotos[lightboxIndex]}
            alt={`${photoAlt} ${lightboxIndex + 1}`}
            className="gallery-v2__lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="gallery-v2__lightbox-nav gallery-v2__lightbox-nav--next"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((i) => (i + 1) % gridPhotos.length)
            }}
            aria-label={lang === 'en' ? 'Next photo' : 'Siguiente foto'}
          >
            <i className="bi bi-chevron-right" />
          </button>
          <span className="gallery-v2__lightbox-counter">
            {lightboxIndex + 1} / {gridPhotos.length}
          </span>
        </div>
      )}
    </section>
  )
}
