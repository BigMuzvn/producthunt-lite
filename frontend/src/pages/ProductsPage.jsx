import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'
import { getProducts, searchProducts, getMyVotes } from '../services/product.service'
import { getToken } from '../services/auth.service'

function PopularIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

function RecentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  const [products, setProducts] = useState([])
  const [votedIds, setVotedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('votes')

  useEffect(() => {
    if (getToken()) {
      getMyVotes()
        .then(myVotes => setVotedIds(new Set(Array.isArray(myVotes) ? myVotes : [])))
        .catch(() => {})
    }
  }, [])

  useEffect(() => {
    document.title = searchQuery
      ? `Recherche "${searchQuery}" — ProductHunt Lite`
      : 'Tous les produits — ProductHunt Lite'
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    const request = searchQuery ? searchProducts(searchQuery, sortBy) : getProducts(sortBy)
    request.then(setProducts).catch(() => {}).finally(() => setLoading(false))
  }, [searchQuery, sortBy])

  return (
    <div className="app-shell">
      <Header />
      <main className="products-page-main" style={{ padding: '48px 0 80px', minHeight: '80vh' }}>
        <div className="container">
          {/* Header Banner */}
          <div className="products-page-header" style={{ marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 9999, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', color: '#A5B4FC', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{searchQuery ? 'Recherche de projets' : 'Catalogue Complet'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                  {searchQuery ? `Résultats pour "${searchQuery}"` : 'Tous les produits tech'}
                </h1>
                <p style={{ margin: 0, fontSize: 15, color: 'var(--text-secondary)', maxWidth: 620, lineHeight: 1.5 }}>
                  {searchQuery
                    ? `Découvrez les produits correspondant au mot-clé "${searchQuery}".`
                    : 'Explorez l’ensemble des innovations partagées par la communauté, votez pour vos outils préférés et échangez directement avec les créateurs.'}
                </p>
              </div>

              {/* Barre de tri & filtre */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(13, 19, 33, 0.75)', padding: '6px', borderRadius: 14, border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(12px)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', padding: '0 8px' }}>
                  Trier :
                </span>
                <button
                  type="button"
                  className="filter-toggle-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: 10,
                    border: '1px solid',
                    borderColor: sortBy === 'votes' ? 'rgba(99, 102, 241, 0.5)' : 'transparent',
                    background: sortBy === 'votes' ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(56, 189, 248, 0.2) 100%)' : 'transparent',
                    color: sortBy === 'votes' ? '#38BDF8' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setSortBy('votes')}
                >
                  <PopularIcon />
                  Plus populaires
                </button>
                <button
                  type="button"
                  className="filter-toggle-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    fontSize: 13,
                    fontWeight: 600,
                    borderRadius: 10,
                    border: '1px solid',
                    borderColor: sortBy === 'recent' ? 'rgba(99, 102, 241, 0.5)' : 'transparent',
                    background: sortBy === 'recent' ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(56, 189, 248, 0.2) 100%)' : 'transparent',
                    color: sortBy === 'recent' ? '#38BDF8' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setSortBy('recent')}
                >
                  <RecentIcon />
                  Plus récents
                </button>
              </div>
            </div>
          </div>

          {/* Section Liste */}
          <div className="products-list-wrapper">
            {loading && <ProductSkeleton count={5} />}

            {!loading && products.length === 0 && (
              <div className="empty-state" style={{ padding: '60px 24px', textAlign: 'center', background: 'rgba(13, 19, 33, 0.5)', borderRadius: 20, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cyan)' }}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h3 style={{ color: '#FFFFFF', marginBottom: 8, fontSize: 18, fontFamily: 'var(--font-display)' }}>
                  Aucun produit trouvé
                </h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto 20px', fontSize: 14 }}>
                  {searchQuery
                    ? `Nous n'avons trouvé aucun produit correspondant à "${searchQuery}".`
                    : 'Aucun produit disponible pour le moment.'}
                </p>
                {searchQuery && (
                  <Link to="/products" className="btn btn-secondary">
                    Voir tous les produits
                  </Link>
                )}
              </div>
            )}

            {!loading && products.map((product, index) => (
              <ProductCard
                key={product._id}
                {...product}
                rank={sortBy === 'votes' ? index + 1 : undefined}
                initiallyVoted={votedIds.has(product._id)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}