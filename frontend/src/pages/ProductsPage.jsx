import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'
import { getProducts, searchProducts, getMyVotes } from '../services/product.service'
import { getToken } from '../services/auth.service'

function PopularIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

function RecentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
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
      getMyVotes().then(myVotes => setVotedIds(new Set(myVotes))).catch(() => {})
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
    <>
      <Header />
      <section style={{ padding: '48px 0 80px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: 0 }}>
              {searchQuery ? `Résultats pour "${searchQuery}"` : 'Tous les produits'}
            </h1>
            
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Trier par :</span>
              <button
                type="button"
                className={`btn btn-secondary ${sortBy === 'votes' ? 'active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 14px',
                  fontSize: 13,
                  background: sortBy === 'votes' ? 'var(--accent)' : 'transparent',
                  color: sortBy === 'votes' ? '#fff' : 'inherit',
                  borderColor: sortBy === 'votes' ? 'var(--accent)' : 'var(--border)',
                  cursor: 'pointer'
                }}
                onClick={() => setSortBy('votes')}
              >
                <PopularIcon />
                Plus populaires
              </button>
              <button
                type="button"
                className={`btn btn-secondary ${sortBy === 'recent' ? 'active' : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 14px',
                  fontSize: 13,
                  background: sortBy === 'recent' ? 'var(--accent)' : 'transparent',
                  color: sortBy === 'recent' ? '#fff' : 'inherit',
                  borderColor: sortBy === 'recent' ? 'var(--accent)' : 'var(--border)',
                  cursor: 'pointer'
                }}
                onClick={() => setSortBy('recent')}
              >
                <RecentIcon />
                Plus récents
              </button>
            </div>
          </div>

          {loading && <ProductSkeleton count={4} />}
          {!loading && products.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>Aucun produit trouvé</h3>
              <p>Essaie d'ajuster ta recherche ou de naviguer dans les catégories.</p>
            </div>
          )}
          {!loading && products.map(product => (
            <ProductCard key={product._id} {...product} initiallyVoted={votedIds.has(product._id)} />
          ))}
        </div>
      </section>
    </>
  )
}