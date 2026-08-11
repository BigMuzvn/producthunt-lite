import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
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

  return (
    <>
      <Header />
      <section style={{ padding: '48px 0 80px' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 20 }}>
            Catégories
          </h1>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
            <button
              className={`category-tag ${!activeCategoryId ? 'active' : ''}`}
              onClick={() => setSearchParams({})}
              style={{ cursor: 'pointer', border: 'none' }}
            >
              Tous
            </button>
            {categories.map(c => (
              <button
                key={c._id}
                className={`category-tag ${activeCategoryId === c._id ? 'active' : ''}`}
                onClick={() => setSearchParams({ categoryId: c._id })}
                style={{ cursor: 'pointer', border: 'none' }}
              >
                <span className="category-dot" style={{ background: c.color }}></span>
                {c.name}
              </button>
            ))}
          </div>

          {loading && <p>Chargement...</p>}
          {!loading && products.length === 0 && <p>Aucun produit dans cette catégorie.</p>}
          {!loading && products.map(product => (
            <ProductCard key={product._id} {...product} initiallyVoted={votedIds.has(product._id)} />
          ))}
        </div>
      </section>
    </>
  )
}