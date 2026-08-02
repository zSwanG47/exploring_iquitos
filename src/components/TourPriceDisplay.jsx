export default function TourPriceDisplay({ price, loading, className = '' }) {
  if (loading) {
    return (
      <span className={`spinner-border spinner-border-sm text-success ${className}`.trim()} role="status" aria-label="Cargando precio" />
    )
  }
  if (price == null) return null
  return <span className={className}>${price}</span>
}
