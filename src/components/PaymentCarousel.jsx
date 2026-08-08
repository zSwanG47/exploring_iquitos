import '../styles/payment-carousel.css'

const PAYMENT_LOGOS = [
  { name: 'BCP', src: '/images/payments/bcp.png' },
  { name: 'Yape', src: '/images/payments/yape.png', square: true },
  { name: 'Plin', src: '/images/payments/plin.svg', square: true },
  { name: 'Efectivo', src: '/images/payments/efectivo.svg' },
  { name: 'Transferencias', src: '/images/payments/transferencias.svg' },
  { name: 'PayPal', src: '/images/payments/paypal.svg' },
  { name: 'Scotiabank', src: '/images/payments/scotiabank.svg' },
  { name: 'Interbank', src: '/images/payments/interbank.svg' },
]

export default function PaymentCarousel() {
  const loop = [...PAYMENT_LOGOS, ...PAYMENT_LOGOS]

  return (
    <div className="payment-carousel" aria-label="Métodos de pago">
      <div className="payment-carousel__fade payment-carousel__fade--left" aria-hidden="true" />
      <div className="payment-carousel__fade payment-carousel__fade--right" aria-hidden="true" />
      <div className="payment-carousel__track">
        {loop.map(({ name, src, square }, i) => (
          <div
            className={`payment-carousel__item${square ? ' payment-carousel__item--square' : ''}`}
            key={`${name}-${i}`}
          >
            <img src={src} alt={name} loading="lazy" draggable="false" />
          </div>
        ))}
      </div>
    </div>
  )
}
