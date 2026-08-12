import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SettingsModal from '../components/SettingsModal'
import ProductCard from '../components/ProductCard'
import '../components/SettingsModal.css'
import { getUser, logout, getBookmarks } from '../services/auth.service'
import { getMyProducts, deleteProduct } from '../services/product.service'
import './DashboardPage.css'

export default function DashboardPage() {
  const user = getUser()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('my-products') // 'my-products' | 'bookmarks'
  const [products, setProducts] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    document.title = 'Mon Espace Maker — ProductHunt Lite'
    Promise.all([
      getMyProducts().catch(() => []),
      getBookmarks().catch(() => ({ bookmarks: [] }))
    ]).then(([myProds, bms]) => {
      setProducts(Array.isArray(myProds) ? myProds : [])
      setBookmarks(Array.isArray(bms.bookmarks) ? bms.bookmarks : [])
    }).finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer définitivement ce produit ?')) return
    await deleteProduct(id)
    setProducts(products.filter(p => p._id !== id))
  }

  const totalVotes = products.reduce((sum, p) => sum + (p.votesCount || 0), 0)

  return (
    <div className="app-shell">
      <Header />

      <main className="dash-page">
        <div className="container">
          {/* Header du Dashboard */}
          <div className="dash-top">
            <div>
              <div className="dash-eyebrow-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>ESPACE MAKER</span>
              </div>
              <h1 className="dash-title">
                Bienvenue{user?.name ? `, ${user.name}` : ''}
              </h1>
            </div>

            <div className="dash-actions">
              {user?._id && (
                <Link to={`/maker/${user._id}`} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Mon profil public</span>
                </Link>
              )}

              <Link to="/submit" className="btn btn-primary btn-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Soumettre un produit</span>
              </Link>

              <button className="btn btn-secondary" onClick={() => setShowSettings(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Paramètres</span>
              </button>

              <button className="btn btn-secondary" onClick={handleLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>

          {/* Grille des 3 Cartes Métriques */}
          <div className="dash-stats">
            <div className="dash-stat-card">
              <div className="dash-stat-top">
                <div className="dash-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                </div>
                <span className="dash-stat-tag">Projets</span>
              </div>
              <span className="dash-stat-value">{products.length}</span>
              <span className="dash-stat-label">Produits soumis</span>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-top">
                <div className="dash-stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <span className="dash-stat-tag cyan-tag">Engagement</span>
              </div>
              <span className="dash-stat-value">{totalVotes.toLocaleString('fr-FR')}</span>
              <span className="dash-stat-label">Votes reçus au total</span>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-top">
                <div className="dash-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="dash-stat-tag green-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', display: 'inline-block' }} />
                  En ligne
                </span>
              </div>
              <span className="dash-stat-value" style={{ fontSize: 'clamp(18px, 1.8vw, 22px)', wordBreak: 'break-all' }}>
                {user?.email || '—'}
              </span>
              <span className="dash-stat-label">Compte connecté</span>
            </div>
          </div>

          {/* Nav Onglets Dashboard */}
          <div className="admin-tabs" style={{ marginBottom: 28 }}>
            <button className={activeTab === 'my-products' ? 'active' : ''} onClick={() => setActiveTab('my-products')}>
              Mes produits ({products.length})
            </button>
            <button className={activeTab === 'bookmarks' ? 'active' : ''} onClick={() => setActiveTab('bookmarks')}>
              Mes favoris ({bookmarks.length})
            </button>
          </div>

          {/* Onglet 1 : Mes Produits */}
          {activeTab === 'my-products' && (
            <div>
              {loading && <p style={{ color: 'var(--text-muted)' }}>Chargement...</p>}

              {!loading && products.length === 0 && (
                <div className="dash-empty-card">
                  <h4 style={{ margin: 0, fontSize: 18, color: '#FFFFFF' }}>Vous n'avez pas encore soumis de projet</h4>
                  <p style={{ margin: '8px 0 16px', fontSize: 14, color: 'var(--text-secondary)' }}>
                    Partagez votre outil ou application pour recevoir vos premiers upvotes !
                  </p>
                  <Link to="/submit" className="btn btn-primary btn-glow">+ Soumettre mon premier produit</Link>
                </div>
              )}

              <div className="dash-product-list">
                {products.map(p => (
                  <div key={p._id} className="dash-product-row">
                    <img
                      src={p.logoUrl || 'https://placehold.co/52/1e293b/ffffff?text=' + encodeURIComponent(p.name?.charAt(0) || 'P')}
                      alt={p.name}
                      className="dash-product-logo"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/52/1e293b/ffffff?text=' + encodeURIComponent(p.name?.charAt(0) || 'P')
                      }}
                    />

                    <div className="dash-product-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <Link to={`/products/${p._id}`} className="dash-product-title-link">
                          <h4>{p.name}</h4>
                        </Link>
                        {p.categoryId?.name && (
                          <span className="category-tag">
                            <span className="category-dot" style={{ background: p.categoryId.color || '#38BDF8' }}></span>
                            {p.categoryId.name}
                          </span>
                        )}
                      </div>
                      <p>{p.tagline}</p>
                    </div>

                    <div className="dash-product-actions">
                      <span className="dash-votes-pill">
                        ▲ <span>{p.votesCount || 0}</span>
                      </span>

                      <Link to={`/products/${p._id}/edit`} className="btn btn-secondary dash-btn-action" title="Modifier le produit">
                        Modifier
                      </Link>

                      <button onClick={() => handleDelete(p._id)} className="dash-btn-delete" title="Supprimer le produit">
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Onglet 2 : Mes Favoris (Bookmarks) */}
          {activeTab === 'bookmarks' && (
            <div>
              {bookmarks.length === 0 ? (
                <div className="dash-empty-card">
                  <h4 style={{ margin: 0, fontSize: 18, color: '#FFFFFF' }}>Aucun produit enregistré dans vos favoris</h4>
                  <p style={{ margin: '8px 0 16px', fontSize: 14, color: 'var(--text-secondary)' }}>
                    Cliquez sur l'icône marque-page sur n'importe quelle carte de produit pour le retrouver ici !
                  </p>
                  <Link to="/products" className="btn btn-primary">Explorer les produits</Link>
                </div>
              ) : (
                <div className="products-grid">
                  {bookmarks.map(p => (
                    <ProductCard key={p._id} {...p} initiallyBookmarked={true} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  )
}