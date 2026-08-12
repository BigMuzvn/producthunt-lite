import { exportToCsv } from '../../utils/exportCsv'

export default function AdminUsersTab({
  users,
  userSearch,
  setUserSearch,
  setDetailsUser,
  handleDeleteUser
}) {
  const filteredClients = users.filter(u =>
    !u.isAdmin &&
    !u.isSuperAdmin &&
    (u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
     u.email.toLowerCase().includes(userSearch.toLowerCase()))
  )

  function handleExportCsv() {
    const headers = ['ID', 'Nom', 'Email', 'Produits soumis', 'Date d\'inscription']
    const rows = filteredClients.map(u => [
      u._id,
      u.name,
      u.email,
      u.productsCount || 0,
      new Date(u.createdAt).toLocaleDateString('fr-FR')
    ])
    exportToCsv('utilisateurs_producthunt_lite', headers, rows)
  }

  return (
    <div className="admin-tab-content">
      {/* Barre d'actions & Recherche */}
      <div className="admin-tab-toolbar">
        <div className="admin-search-wrapper">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="admin-search-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par nom ou adresse email..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleExportCsv}
          disabled={filteredClients.length === 0}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Exporter CSV ({filteredClients.length})</span>
        </button>
      </div>

      {/* Liste des Clients */}
      <div className="admin-table">
        {filteredClients.map(u => (
          <div key={u._id} className="admin-row">
            <div className="admin-user-avatar">
              {u.name?.charAt(0)?.toUpperCase() || 'C'}
            </div>

            <div className="admin-row-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <strong className="admin-row-title">{u.name}</strong>
                <span className="admin-badge admin-badge-client">Client</span>
              </div>
              <p className="admin-row-sub">{u.email}</p>
              <p className="admin-row-meta">
                {u.productsCount || 0} produit(s) soumis • inscrit le {new Date(u.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>

            <div className="admin-row-actions">
              <button className="btn btn-secondary" onClick={() => setDetailsUser(u)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Détails</span>
              </button>

              <button className="dash-btn-delete" onClick={() => handleDeleteUser(u._id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="admin-empty">
            <p>Aucun client ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  )
}
