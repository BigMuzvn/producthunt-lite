import { exportToCsv } from '../../utils/exportCsv'

export default function AdminProductsTab({ products, handleDeleteProduct }) {
  function handleExportCsv() {
    const headers = ['ID', 'Nom', 'Tagline', 'Catégorie', 'Votes', 'Créateur', 'Site Web', 'Date de création']
    const rows = products.map(p => [
      p._id,
      p.name,
      p.tagline,
      p.categoryId?.name || '',
      p.votesCount || 0,
      p.makerId?.name || '',
      p.websiteUrl || '',
      new Date(p.createdAt).toLocaleDateString('fr-FR')
    ])
    exportToCsv('produits_producthunt_lite', headers, rows)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleExportCsv}
          disabled={products.length === 0}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exporter CSV ({products.length})
        </button>
      </div>

      <div className="admin-table">
        {products.map(p => (
          <div key={p._id} className="admin-row">
            <img src={p.logoUrl || 'https://placehold.co/40'} alt={p.name} className="admin-row-logo" loading="lazy" />
            <div className="admin-row-info">
              <strong>{p.name}</strong>
              <p>{p.tagline}</p>
              <p className="admin-row-meta">
                {p.categoryId?.name} — {p.votesCount} votes — par {p.makerId?.name}
              </p>
            </div>
            <div className="admin-row-actions">
              <button className="btn btn-secondary" style={{ color: '#B3261E' }} onClick={() => handleDeleteProduct(p._id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="admin-empty">Aucun produit référencé.</p>}
      </div>
    </div>
  )
}
