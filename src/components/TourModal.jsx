import { useEffect, useRef } from 'react'
import { Modal } from 'bootstrap'
import { useTourPrices } from '../context/TourPricesContext'
import { useLang } from '../context/LanguageContext'
import { getLocalizedTour } from '../data/toursData'

const WA_NUMBER = '51999999999'

export default function TourModal({ tour, onClose }) {
  const modalRef = useRef(null)
  const bsModalRef = useRef(null)
  const prices = useTourPrices()
  const { lang } = useLang()
  const localTour = getLocalizedTour(tour, lang)
  const price = tour ? (prices[tour.id] ?? tour.price) : 0

  // Inicializar instancia Bootstrap Modal una sola vez
  useEffect(() => {
    if (!modalRef.current) return
    bsModalRef.current = new Modal(modalRef.current)
    const el = modalRef.current
    el.addEventListener('hidden.bs.modal', onClose)
    return () => {
      el.removeEventListener('hidden.bs.modal', onClose)
      bsModalRef.current?.dispose()
    }
  }, [onClose])

  // Mostrar / ocultar cuando cambia el tour seleccionado
  useEffect(() => {
    if (tour) {
      bsModalRef.current?.show()
    } else {
      bsModalRef.current?.hide()
    }
  }, [tour])

  const msg = localTour
    ? encodeURIComponent(
        `Hola, me interesa el ${localTour.name} (${localTour.subtitle}) por $${price} USD. Quisiera mas informacion.`
      )
    : ''
  const waLink = `https://wa.me/${WA_NUMBER}?text=${msg}`

  return (
    <div
      className="modal fade"
      ref={modalRef}
      tabIndex={-1}
      aria-labelledby="tourModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header" style={{ backgroundColor: 'var(--green-primary)' }}>
            <div>
              <h5 className="modal-title text-white fw-bold mb-0" id="tourModalLabel">
                {localTour?.name}
              </h5>
              {localTour && (
                <small className="text-white-50">
                  <i className="bi bi-clock me-1" />
                  {localTour.subtitle} &mdash; ${price} USD / persona
                </small>
              )}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            />
          </div>

          {/* Body */}
          <div className="modal-body p-0">
            {tour && (
              <>
                {/* Imagen + info rápida */}
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={tour.image}
                      alt={localTour.name}
                      className="img-fluid w-100"
                      style={{ maxHeight: '240px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-8 p-4">
                    <h6 className="fw-bold mb-2" style={{ color: 'var(--green-primary)' }}>
                      Descripcion
                    </h6>
                    <p className="text-muted mb-3">{localTour.description}</p>

                    <h6 className="fw-bold mb-2" style={{ color: 'var(--green-primary)' }}>
                      Incluye
                    </h6>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {localTour.includes.map((item) => (
                        <span
                          key={item}
                          className="badge rounded-pill"
                          style={{ backgroundColor: '#d4edda', color: '#145228' }}
                        >
                          <i className="bi bi-check2 me-1" />
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Enlace para abrir PDF en dispositivos móviles */}
                    <a
                      href={tour.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-success btn-sm"
                    >
                      <i className="bi bi-file-earmark-pdf me-1" />
                      Abrir itinerario completo (PDF)
                    </a>
                  </div>
                </div>

                {/* Divisor */}
                <hr className="my-0" />

                {/* PDF embed — oculto en pantallas muy pequeñas */}
                <div className="d-none d-sm-block">
                  <div className="p-3 pb-0">
                    <p className="text-muted small mb-2">
                      <i className="bi bi-info-circle me-1" />
                      Si el PDF no carga, usa el enlace de arriba para abrirlo en una nueva pestana.
                    </p>
                  </div>
                  <iframe
                    src={tour.pdf}
                    title={`Itinerario ${tour.name}`}
                    width="100%"
                    style={{ height: '65vh', border: 'none' }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
            {tour && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success fw-semibold"
              >
                <i className="bi bi-whatsapp me-2" />
                Reservar por WhatsApp
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
