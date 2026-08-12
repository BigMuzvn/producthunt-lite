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
    <div className="admin-overview-container">
      {/* 4 Cartes de Statistiques Générales */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <div className="admin-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="admin-stat-tag">Communauté</span>
          </div>
          <span className="admin-stat-value">{(stats.totals?.totalClients ?? 0).toLocaleString('fr-FR')}</span>
          <span className="admin-stat-label">Clients & Makers Inscrits</span>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <div className="admin-stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="admin-stat-tag purple-tag">Équipe</span>
          </div>
          <span className="admin-stat-value">{(stats.totals?.totalAdmins ?? 0).toLocaleString('fr-FR')}</span>
          <span className="admin-stat-label">Administrateurs Actifs</span>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <div className="admin-stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              </svg>
            </div>
            <span className="admin-stat-tag cyan-tag">Catalogue</span>
          </div>
          <span className="admin-stat-value">{(stats.totals?.totalProducts ?? 0).toLocaleString('fr-FR')}</span>
          <span className="admin-stat-label">Produits & Pépites</span>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-top">
            <div className="admin-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span className="admin-stat-tag green-tag">Activité</span>
          </div>
          <span className="admin-stat-value">{(stats.totals?.totalVotes ?? 0).toLocaleString('fr-FR')}</span>
          <span className="admin-stat-label">Votes Communautaires</span>
        </div>
      </div>

      {/* Graphique d'Évolution sur 7 Jours */}
      <div className="admin-evolution-card">
        <div className="admin-card-header">
          <div>
            <div className="admin-card-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>CROISSANCE</span>
            </div>
            <h3 style={{ margin: '4px 0 0', fontSize: 18, color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>
              Activité des 7 derniers jours
            </h3>
          </div>
          <div className="admin-evolution-legend">
            <span className="admin-evolution-legend-item">
              <span className="admin-evolution-legend-dot admin-evolution-bar-users" />
              Nouvelles Inscriptions
            </span>
            <span className="admin-evolution-legend-item">
              <span className="admin-evolution-legend-dot admin-evolution-bar-votes" />
              Nouveaux Votes
            </span>
          </div>
        </div>

        <div className="admin-evolution-chart">
          {evolution.map(d => {
            const userHeight = Math.max(((d.newUsers || 0) / evolutionMax) * 100, 6)
            const voteHeight = Math.max(((d.newVotes || 0) / evolutionMax) * 100, 6)
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
      </div>

      {/* Grille 1 : Top Produits & Répartition par Catégorie */}
      <div className="admin-panels-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3 style={{ margin: 0 }}>Top Produits Référencés</h3>
            <span className="admin-panel-badge">Par upvotes</span>
          </div>

          {topProducts.length === 0 && <p className="admin-empty">Aucun produit pour l'instant.</p>}

          <div className="admin-top-products-list">
            {topProducts.map((p, i) => (
              <div key={p._id} className="admin-product-item">
                <span className={`admin-rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''}`}>
                  #{i + 1}
                </span>
                <img
                  src={p.logoUrl || 'https://placehold.co/40/1e293b/ffffff?text=' + encodeURIComponent(p.name?.charAt(0) || 'P')}
                  alt={p.name}
                  className="admin-product-item-logo"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/40/1e293b/ffffff?text=' + encodeURIComponent(p.name?.charAt(0) || 'P')
                  }}
                />
                <div className="admin-product-item-info">
                  <strong>{p.name}</strong>
                  <p>{p.tagline || 'Produit membre'}</p>
                </div>
                <span className="admin-votes-pill">▲ {p.votesCount || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3 style={{ margin: 0 }}>Répartition par Catégorie</h3>
            <span className="admin-panel-badge">{categoryBreakdown.length} Catégories</span>
          </div>

          {categoryBreakdown.length === 0 && <p className="admin-empty">Aucune catégorie répertoriée.</p>}

          <div className="admin-category-bars-list">
            {categoryBreakdown.map(c => {
              const percentage = Math.round((c.count / categoryMax) * 100)
              return (
                <div key={c.name} className="admin-category-bar-row">
                  <div className="admin-category-bar-label">
                    <span className="admin-category-dot" style={{ background: c.color || '#38BDF8' }} />
                    <span className="admin-category-bar-name">{c.name}</span>
                  </div>
                  <div className="admin-category-bar-track">
                    <div
                      className="admin-category-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        background: c.color || '#38BDF8'
                      }}
                    />
                  </div>
                  <span className="admin-category-bar-count">{c.count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Grille 2 : Dernières Inscriptions & Derniers Produits */}
      <div className="admin-panels-grid">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3 style={{ margin: 0 }}>Dernières Inscriptions</h3>
            <span className="admin-panel-badge">Clients</span>
          </div>

          {recentUsers.length === 0 && <p className="admin-empty">Aucune inscription récente.</p>}

          <div className="admin-recent-list">
            {recentUsers.map(u => (
              <div key={u._id} className="admin-recent-item">
                <div className="admin-user-avatar">
                  {u.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="admin-user-info">
                  <strong>{u.name}</strong>
                  <p>{u.email}</p>
                </div>
                <span className="admin-row-meta">
                  {new Date(u.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3 style={{ margin: 0 }}>Derniers Produits Soumis</h3>
            <span className="admin-panel-badge">Nouveautés</span>
          </div>

          {recentProducts.length === 0 && <p className="admin-empty">Aucun produit récent.</p>}

          <div className="admin-recent-list">
            {recentProducts.map(p => (
              <div key={p._id} className="admin-recent-item">
                <img
                  src={p.logoUrl || 'https://placehold.co/36/1e293b/ffffff?text=' + encodeURIComponent(p.name?.charAt(0) || 'P')}
                  alt={p.name}
                  className="admin-recent-logo"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/36/1e293b/ffffff?text=' + encodeURIComponent(p.name?.charAt(0) || 'P')
                  }}
                />
                <div className="admin-recent-info">
                  <strong>{p.name}</strong>
                  <p>par {p.makerId?.name || 'Inconnu'}</p>
                </div>
                <span className="admin-row-meta">
                  {new Date(p.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
