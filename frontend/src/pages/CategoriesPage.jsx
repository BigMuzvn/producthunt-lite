import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'
import { getCategories } from '../services/category.service'
import { getProducts, getProductsByCategory, getMyVotes } from '../services/product.service'
import { getToken } from '../services/auth.service'

export default function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategoryId = searchParams.get('categoryId')

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [votedIds, setVotedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Catégories — ProductHunt Lite'
    getCategories().then(setCategories).catch(() => {})

    if (getToken()) {
      getMyVotes().then(myVotes => setVotedIds(new Set(myVotes))).catch(() => {})
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    const request = activeCategoryId ? getProductsByCategory(activeCategoryId) : getProducts()
    request.then(setProducts).catch(() => {}).finally(() => setLoading(false))
  }, [activeCategoryId])

  const activeCategory = categories.find(c => c._id === activeCategoryId)

  return (
    <div className="app-shell">
      <Header />
      <main className="categories-page-main" style={{ padding: '48px 0 80px', minHeight: '80vh' }}>
        <div className="container">
          {/* Header Banner */}
          <div className="categories-page-header" style={{ marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 9999, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', color: '#A5B4FC', fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              <span>Exploration Thématique</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                  {activeCategory ? activeCategory.name : 'Toutes les catégories'}
                </h1>
                <p style={{ margin: 0, fontSize: 15, color: 'var(--text-secondary)', maxWidth: 640, lineHeight: 1.5 }}>
                  {activeCategory
                    ? `Découvrez l'ensemble des innovations répertoriées dans la thématique "${activeCategory.name}".`
                    : 'Filtrez les projets selon votre domaine de prédilection et explorez les meilleurs outils développés par la communauté.'}
                </p>
              </div>

              {!loading && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 12, background: 'rgba(13, 19, 33, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: activeCategory?.color || 'var(--accent)', boxShadow: `0 0 8px ${activeCategory?.color || 'var(--accent)'}` }}></span>
                  <span style={{ color: '#F8FAFC' }}>{products.length}</span> produit{products.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          {/* Filter Pills Toolbar */}
          <div style={{ background: 'rgba(13, 19, 33, 0.72)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 18, padding: '20px 22px', marginBottom: 36, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Filtrer par thématique
              </span>
              {activeCategoryId && (
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: 8,
                    color: '#38BDF8',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '4px 10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>✕</span>
                  <span>Effacer le filtre</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                className="category-filter-pill"
                onClick={() => setSearchParams({})}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 18px',
                  borderRadius: 12,
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  border: '1px solid',
                  borderColor: !activeCategoryId ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.08)',
                  background: !activeCategoryId ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(56, 189, 248, 0.2) 100%)' : 'rgba(255, 255, 255, 0.03)',
                  color: !activeCategoryId ? '#FFFFFF' : 'var(--text-secondary)',
                  boxShadow: !activeCategoryId ? '0 4px 16px rgba(99, 102, 241, 0.25)' : 'none'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="7" height="7" x="3" y="3" rx="1"/>
                  <rect width="7" height="7" x="14" y="3" rx="1"/>
                  <rect width="7" height="7" x="14" y="14" rx="1"/>
                  <rect width="7" height="7" x="3" y="14" rx="1"/>
                </svg>
                <span>Toutes les catégories</span>
              </button>

              {categories.map(c => {
                const isActive = activeCategoryId === c._id
                return (
                  <button
                    key={c._id}
                    type="button"
                    className="category-filter-pill"
                    onClick={() => setSearchParams({ categoryId: c._id })}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 18px',
                      borderRadius: 12,
                      fontSize: 13.5,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      border: '1px solid',
                      borderColor: isActive ? (c.color || 'var(--accent)') : 'rgba(255, 255, 255, 0.08)',
                      background: isActive ? `${c.color || 'var(--accent)'}25` : 'rgba(255, 255, 255, 0.03)',
                      color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                      boxShadow: isActive ? `0 4px 16px ${c.color || 'var(--accent)'}40` : 'none'
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: c.color || 'var(--accent)',
                        boxShadow: `0 0 8px ${c.color || 'var(--accent)'}`
                      }}
                    />
                    <span>{c.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Products List Section */}
          <div className="categories-products-list">
            {loading && <ProductSkeleton count={4} />}

            {!loading && products.length === 0 && (
              <div className="empty-state" style={{ padding: '60px 24px', textAlign: 'center', background: 'rgba(13, 19, 33, 0.5)', borderRadius: 20, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cyan)' }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 style={{ color: '#FFFFFF', marginBottom: 8, fontSize: 18, fontFamily: 'var(--font-display)' }}>
                  Aucun produit dans cette catégorie
                </h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto 20px', fontSize: 14 }}>
                  Soyez le premier à soumettre un projet dans {activeCategory ? `la catégorie ${activeCategory.name}` : 'cette thématique'} !
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSearchParams({})}
                >
                  Voir toutes les catégories
                </button>
              </div>
            )}

            {!loading && products.map(product => (
              <ProductCard
                key={product._id}
                {...product}
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