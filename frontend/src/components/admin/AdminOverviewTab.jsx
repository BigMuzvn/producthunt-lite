export default function AdminOverviewTab({ stats }) {
  if (!stats) return null

  const categoryBreakdown = stats.categoryBreakdown || []
  const evolution = stats.evolution || []
  const topProducts = stats.topProducts || []
  const recentUsers = stats.recentActivity?.recentUsers || []
  const recentProducts = stats.recentActivity?.recentProducts || []

  const categoryMax = Math.max(...categoryBreakdown.map(c => c.count), 1)
  const evolutionMax = Math.max(...evolution.map(d => Math.max(d.newUsers || 0, d.newVotes || 0)), 1)

  return (
    <div>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-value">{stats.totals?.totalClients ?? 0}</span>
          <span className="admin-stat-label">Clients inscrits</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{stats.totals?.totalAdmins ?? 0}</span>
          <span className="admin-stat-label">Administrateurs</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{stats.totals?.totalProducts ?? 0}</span>
          <span className="admin-stat-label">Produits référencés</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{stats.totals?.totalVotes ?? 0}</span>
          <span className="admin-stat-label">Votes enregistrés</span>
        </div>
      </div>

      <div className="admin-evolution-card">
        <h3>Évolution sur les 7 derniers jours</h3>
        <div className="admin-evolution-chart">
          {evolution.map(d => {
            const userHeight = Math.max(((d.newUsers || 0) / evolutionMax) * 100, 4)
            const voteHeight = Math.max(((d.newVotes || 0) / evolutionMax) * 100, 4)
            const dateObj = new Date(d.date)
            const label = dateObj.toLocaleDateString('fr-FR', { weekday: 'short' })

            return (
              <div key={d.date} className="admin-evolution-day">
                <div className="admin-evolution-bars">
                  <div
                    className="admin-evolution-bar admin-evolution-bar-users"
                    style={{ height: `${userHeight}%` }}
                    title={`${d.newUsers || 0} inscription(s)`}
                  />
                  <div
                    className="admin-evolution-bar admin-evolution-bar-votes"
                    style={{ height: `${voteHeight}%` }}
                    title={`${d.newVotes || 0} vote(s)`}
                  />
                </div>
                <span className="admin-evolution-label">{label}</span>
              </div>
            )
          })}
        </div>
        <div className="admin-evolution-legend">
          <span className="admin-evolution-legend-item">
            <span className="admin-evolution-legend-dot admin-evolution-bar-users" />
            Inscriptions
          </span>
          <span className="admin-evolution-legend-item">
            <span className="admin-evolution-legend-dot admin-evolution-bar-votes" />
            Votes
          </span>
        </div>
      </div>

      <div className="admin-panels-grid">
        <div className="admin-panel">
          <h3>Top produits</h3>
          {topProducts.length === 0 && <p className="admin-empty">Aucun produit pour l'instant.</p>}
          {topProducts.map((p, i) => (
            <div key={p._id} className="admin-row admin-row-compact" style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 700, color: 'var(--text-muted)', width: 16 }}>{i + 1}</span>
              <img src={p.logoUrl || 'https://placehold.co/32'} alt={p.name} className="admin-row-logo" style={{ width: 32, height: 32 }} loading="lazy" />
              <div className="admin-row-info">
                <strong>{p.name}</strong>
              </div>
              <span className="admin-badge">{p.votesCount} votes</span>
            </div>
          ))}
        </div>

        <div className="admin-panel">
          <h3>Répartition par catégorie</h3>
          {categoryBreakdown.length === 0 && <p className="admin-empty">Aucune catégorie.</p>}
          {categoryBreakdown.map(c => (
            <div key={c.name} className="admin-category-bar-row">
              <span className="category-dot" style={{ background: c.color }} />
              <span className="admin-category-bar-name">{c.name}</span>
              <div className="admin-category-bar-track">
                <div
                  className="admin-category-bar-fill"
                  style={{
                    width: `${Math.round((c.count / categoryMax) * 100)}%`,
                    background: c.color
                  }}
                />
              </div>
              <span className="admin-category-bar-count">{c.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-panels-grid">
        <div className="admin-panel">
          <h3>Dernières inscriptions</h3>
          {recentUsers.length === 0 && <p className="admin-empty">Aucune inscription récente.</p>}
          {recentUsers.map(u => (
            <div key={u._id} className="admin-row admin-row-compact" style={{ marginBottom: 8 }}>
              <div className="admin-row-info">
                <strong>{u.name}</strong>
                <p>{u.email}</p>
              </div>
              <span className="admin-row-meta">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          ))}
        </div>

        <div className="admin-panel">
          <h3>Derniers produits soumis</h3>
          {recentProducts.length === 0 && <p className="admin-empty">Aucun produit récent.</p>}
          {recentProducts.map(p => (
            <div key={p._id} className="admin-row admin-row-compact" style={{ marginBottom: 8 }}>
              <img src={p.logoUrl || 'https://placehold.co/32'} alt={p.name} className="admin-row-logo" style={{ width: 32, height: 32 }} loading="lazy" />
              <div className="admin-row-info">
                <strong>{p.name}</strong>
                <p>par {p.makerId?.name || 'Inconnu'}</p>
              </div>
              <span className="admin-row-meta">{new Date(p.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
