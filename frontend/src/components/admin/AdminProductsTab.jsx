import { useState } from 'react'
import { Link } from 'react-router-dom'
import { exportToCsv } from '../../utils/exportCsv'
import { getImageUrl } from '../../services/upload.service'

export default function AdminProductsTab({ products, handleDeleteProduct }) {
  const [search, setSearch] = useState('')

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.tagline && p.tagline.toLowerCase().includes(search.toLowerCase())) ||
    (p.makerId?.name && p.makerId.name.toLowerCase().includes(search.toLowerCase()))
  )

  function handleExportCsv() {
    const headers = ['ID', 'Nom', 'Tagline', 'Catégorie', 'Votes', 'Créateur', 'Site Web', 'Date de création']
    const rows = filteredProducts.map(p => [
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
    <div className="admin-tab-content">
      {/* Toolbar & Recherche */}
      <div className="admin-tab-toolbar">
        <div className="admin-search-wrapper">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="admin-search-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par nom de produit, tagline ou créateur..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleExportCsv}
          disabled={filteredProducts.length === 0}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Exporter CSV ({filteredProducts.length})</span>
        </button>
      </div>

      {/* Liste des produits */}
      <div className="admin-table">
        {filteredProducts.map(p => (
          <div key={p._id} className="admin-row">
            <img
              src={getImageUrl(p.logoUrl) || 'https://placehold.co/52/1e293b/ffffff?text=' + encodeURIComponent(p.name?.charAt(0) || 'P')}
              alt={p.name}
              className="admin-product-logo-fixed"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/52/1e293b/ffffff?text=' + encodeURIComponent(p.name?.charAt(0) || 'P')
              }}
            />

            <div className="admin-row-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <strong className="admin-row-title">{p.name}</strong>
                {p.categoryId?.name && (
                  <span className="category-tag">
                    <span className="category-dot" style={{ background: p.categoryId.color || '#38BDF8' }} />
                    {p.categoryId.name}
                  </span>
                )}
              </div>
              <p className="admin-row-sub">{p.tagline}</p>
              <p className="admin-row-meta">
                Par <strong>{p.makerId?.name || 'Inconnu'}</strong> • {new Date(p.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>

            <div className="admin-row-actions">
              <span className="admin-votes-pill">▲ {p.votesCount || 0}</span>

              <Link to={`/products/${p._id}`} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 12px', fontSize: 13 }}>
                <span>Voir ↗</span>
              </Link>

              <button className="dash-btn-delete" onClick={() => handleDeleteProduct(p._id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="admin-empty">
            <p>Aucun produit ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  )
}
