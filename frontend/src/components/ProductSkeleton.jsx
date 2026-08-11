export default function ProductSkeleton({ count = 3 }) {
  return (
    <div className="product-skeleton-list">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="product-card skeleton-card">
          <div className="product-body">
            <div className="skeleton-box skeleton-logo" />
            <div className="product-info" style={{ width: '100%' }}>
              <div className="skeleton-box skeleton-title" />
              <div className="skeleton-box skeleton-subtitle" />
            </div>
          </div>
          <div className="skeleton-box skeleton-badge" />
        </div>
      ))}
    </div>
  )
}
