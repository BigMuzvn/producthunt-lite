import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ContactMakerModal from '../components/ContactMakerModal'
import { getMakerProfile } from '../services/auth.service'
import { getImageUrl } from '../services/upload.service'
import './MakerProfilePage.css'

export default function MakerProfilePage() {
  const { id } = useParams()
  const [makerData, setMakerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    getMakerProfile(id)
      .then(data => {
        setMakerData(data)
        document.title = `${data.maker?.name || 'Maker'} — ProductHunt Lite`
        setLoading(false)
      })
      .catch(err => {
        setError(err.message || 'Maker introuvable')
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="app-shell">
        <Header />
        <main className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Chargement du profil maker...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !makerData) {
    return (
      <div className="app-shell">
        <Header />
        <main className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <h2 style={{ color: '#FFFFFF', marginBottom: 12 }}>Maker introuvable</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Le profil que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link to="/products" className="btn btn-primary">Retour aux produits</Link>
        </main>
        <Footer />
      </div>
    )
  }

  const { maker, products, stats } = makerData

  return (
    <div className="app-shell">
      <Header />

      <main className="maker-profile-page">
        <div className="container">
          {/* Header du profil Maker */}
          <div className="maker-card">
            <div className="maker-card-top">
              <div className="maker-avatar">
                {maker.avatarUrl ? (
                  <img src={getImageUrl(maker.avatarUrl)} alt={maker.name} className="maker-avatar-img" />
                ) : (
                  <span>{maker.name?.charAt(0)?.toUpperCase() || 'M'}</span>
                )}
              </div>

              <div className="maker-main-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <h1 className="maker-name">{maker.name}</h1>
                  <span className="maker-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Maker Certifié
                  </span>
                </div>

                <p className="maker-bio">
                  {maker.bio || 'Créateur passionné d’outils web et d’applications logicielles.'}
                </p>

                <div className="maker-meta">
                  <span>Membre depuis {new Date(maker.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="maker-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-glow"
                  onClick={() => setContactOpen(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Contacter le créateur
                </button>
              </div>
            </div>

            {/* Liens Sociaux & Stats */}
            <div className="maker-card-bottom">
              <div className="maker-social-links">
                {maker.githubUrl && (
                  <a href={maker.githubUrl} target="_blank" rel="noopener noreferrer" className="social-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.92.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2z"/>
                    </svg>
                    GitHub
                  </a>
                )}
                {maker.twitterUrl && (
                  <a href={maker.twitterUrl} target="_blank" rel="noopener noreferrer" className="social-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Twitter / X
                  </a>
                )}
                {maker.portfolioUrl && (
                  <a href={maker.portfolioUrl} target="_blank" rel="noopener noreferrer" className="social-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    Portfolio
                  </a>
                )}
              </div>

              <div className="maker-stats-row">
                <div className="maker-stat-box">
                  <span className="stat-num">{stats.totalProducts}</span>
                  <span className="stat-lbl">Produits lancés</span>
                </div>
                <div className="maker-stat-box">
                  <span className="stat-num" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#818CF8' }}>
                      <polygon points="12 2 2 22 22 22" />
                    </svg>
                    {stats.totalVotes}
                  </span>
                  <span className="stat-lbl">Upvotes reçus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section Vitrine des produits */}
          <div className="maker-products-section">
            <h2 className="section-title">Vitrine de ses créations ({products.length})</h2>

            {products.length === 0 ? (
              <p className="admin-empty">Ce maker n'a pas encore publié de produit.</p>
            ) : (
              <div className="products-grid">
                {products.map(p => (
                  <ProductCard key={p._id} {...p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modale de Contact */}
      {contactOpen && (
        <ContactMakerModal
          maker={maker}
          onClose={() => setContactOpen(false)}
        />
      )}

      <Footer />
    </div>
  )
}
