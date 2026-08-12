import { useState } from 'react'
import dashboardPreview from '../assets/dashboard-preview.png'

function DashboardShowcase() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="dashboard-showcase-section">
      <div className="showcase-glow"></div>

      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Espace Maker Dédié</span>
          <h2>Un tableau de bord puissant pour piloter vos lancements</h2>
          <p>
            Suivez vos votes en direct, modifiez vos produits et interagissez avec votre audience depuis un espace pensé pour les créateurs.
          </p>
        </div>

        <div className="showcase-mockup-wrapper">
          {/* Cadre PC / macOS Ultra-Sleek Dark Glass */}
          <div 
            className={`showcase-window ${isHovered ? 'window-hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Barre de fenêtre macOS */}
            <div className="window-header">
              <div className="window-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="window-address-bar">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cyan)' }}>
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>producthunt-lite.app/dashboard</span>
              </div>
              <div className="window-actions">
                <span className="window-pill">Connecté</span>
              </div>
            </div>

            {/* Corps d'écran avec la capture */}
            <div className="window-screen">
              <img 
                src={dashboardPreview} 
                alt="Tableau de bord membre ProductHunt Lite" 
                className="showcase-image"
              />
            </div>
          </div>

          {/* Badges Flottants d'immersion */}
          <div className="showcase-badge badge-left">
            <div className="showcase-badge-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <div>
              <div className="showcase-badge-title">Statistiques en Direct</div>
              <div className="showcase-badge-sub">Votes, clics & portée</div>
            </div>
          </div>

          <div className="showcase-badge badge-right">
            <div className="showcase-badge-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div>
              <div className="showcase-badge-title">Contrôle Total</div>
              <div className="showcase-badge-sub">Édition & suppression instantanées</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardShowcase
