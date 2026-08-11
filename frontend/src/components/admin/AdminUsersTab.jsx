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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={userSearch}
          onChange={e => setUserSearch(e.target.value)}
          className="admin-search"
          style={{ marginBottom: 0 }}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleExportCsv}
          disabled={filteredClients.length === 0}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exporter CSV ({filteredClients.length})
        </button>
      </div>

      <div className="admin-table">
        {filteredClients.map(u => (
          <div key={u._id} className="admin-row">
            <div className="admin-row-info">
              <strong>{u.name}</strong>
              <span className="admin-badge admin-badge-client">Client</span>
              <p>{u.email}</p>
              <p className="admin-row-meta">
                {u.productsCount} produit(s) — inscrit le {new Date(u.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="admin-row-actions">
              <button className="btn btn-secondary" onClick={() => setDetailsUser(u)}>Détails</button>
              <button className="btn btn-secondary" style={{ color: '#B3261E' }} onClick={() => handleDeleteUser(u._id)}>Supprimer</button>
            </div>
          </div>
        ))}
        {filteredClients.length === 0 && <p className="admin-empty">Aucun client trouvé.</p>}
      </div>
    </div>
  )
}
