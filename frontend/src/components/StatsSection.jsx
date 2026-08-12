import { useState, useEffect } from 'react'
import { getPublicStats } from '../services/util.service'

function StatsSection() {
  const [stats, setStats] = useState({
    productsCount: 0,
    votesCount: 0,
    membersCount: 0
  })

  useEffect(() => {
    getPublicStats()
      .then(data => {
        if (data) {
          setStats({
            productsCount: data.productsCount || 0,
            votesCount: data.votesCount || 0,
            membersCount: data.membersCount || 0
          })
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="stats" className="stats-bento-section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Impact & Croissance</span>
          <h2>Une communauté active en pleine expansion</h2>
          <p>
            Chaque jour, des centaines de créateurs et passionnés découvrent, évaluent et propulsent les technologies de demain.
          </p>
        </div>

        <div className="bento-grid">
          {/* Bento Card 1 : Produits Référencés (Large) */}
          <div className="bento-card bento-card-featured">
            <div className="bento-card-top">
              <div className="bento-icon-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m7.5 4.27 9 5.15"/>
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                  <path d="m3.3 7 8.7 5 8.7-5"/>
                  <path d="M12 22V12"/>
                </svg>
              </div>
              <span className="bento-live-badge">
                <span className="bento-live-dot"></span>
                Temps Réel
              </span>
            </div>

            <div className="bento-body">
              <div className="bento-huge-number">{stats.productsCount}</div>
              <h3 className="bento-title">Produits & Outils Référencés</h3>
              <p className="bento-desc">
                Des startups IA aux extensions open-source, découvrez un catalogue riche et rigoureusement sélectionné.
              </p>
            </div>

            <div className="bento-sparkline">
              <span className="spark-bar" style={{ height: '35%' }}></span>
              <span className="spark-bar" style={{ height: '50%' }}></span>
              <span className="spark-bar" style={{ height: '40%' }}></span>
              <span className="spark-bar" style={{ height: '65%' }}></span>
              <span className="spark-bar" style={{ height: '80%' }}></span>
              <span className="spark-bar spark-active" style={{ height: '100%' }}></span>
            </div>
          </div>

          {/* Bento Card 2 : Votes & Engagement */}
          <div className="bento-card">
            <div className="bento-card-top">
              <div className="bento-icon-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--cyan)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <span className="bento-tag">Engagement Top</span>
            </div>

            <div className="bento-body">
              <div className="bento-huge-number text-cyan">{stats.votesCount}</div>
              <h3 className="bento-title">Votes & Retours Membres</h3>
              <p className="bento-desc">
                Une communauté engagée qui plébiscite les projets les plus innovants.
              </p>
            </div>
          </div>

          {/* Bento Card 3 : Makers & Créateurs */}
          <div className="bento-card">
            <div className="bento-card-top">
              <div className="bento-icon-badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#A855F7' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <span className="bento-tag">Écosystème</span>
            </div>

            <div className="bento-body">
              <div className="bento-huge-number text-violet">{stats.membersCount}</div>
              <h3 className="bento-title">Makers & Innovateurs</h3>
              <p className="bento-desc">
                Des fondateurs et ingénieurs passionnés qui échangent quotidiennement.
              </p>
            </div>
          </div>

          {/* Bento Card 4 : 100% Transparent & Équitable */}
          <div className="bento-card bento-card-highlight">
            <div className="bento-card-top">
              <div className="bento-icon-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <span className="bento-tag text-emerald">100% Équitable</span>
            </div>

            <div className="bento-body">
              <div className="bento-huge-number text-emerald">0 €</div>
              <h3 className="bento-title">Gratuit & Indépendant</h3>
              <p className="bento-desc">
                Lancements sans frais, algorithme de vote transparent et protection anti-fraude intégrée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection