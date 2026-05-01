// Actualiza este numero con el WhatsApp real de la empresa
const WA_NUMBER = '51931483071'
const WA_MSG = encodeURIComponent(
  'Hola, me gustaria informarme sobre los tours disponibles en Exploring Iquitos.'
)

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      <i className="bi bi-whatsapp" />
    </a>
  )
}
