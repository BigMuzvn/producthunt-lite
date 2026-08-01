import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { getProducts, searchProducts, getMyVotes } from '../services/product.service'
import { getToken } from '../services/auth.service'

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  const [products, setProducts] = useState([])
  const [votedIds, setVotedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (getToken()) {
      getMyVotes().then(myVotes => setVotedIds(new Set(myVotes))).catch(() => {})
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    const request = searchQuery ? searchProducts(searchQuery) : getProducts()
    request.then(setProducts).catch(() => {}).finally(() => setLoading(false))
  }, [searchQuery])

  return (
    <>
      <Header />
      <section style={{ padding: '48px 0 80px' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 8 }}>
            {searchQuery ? `Résultats pour "${searchQuery}"` : 'Tous les produits'}
          </h1>
          {loading && <p>Chargement...</p>}
          {!loading && products.length === 0 && <p>Aucun produit trouvé.</p>}
          {!loading && products.map(product => (
            <ProductCard key={product._id} {...product} initiallyVoted={votedIds.has(product._id)} />
          ))}
        </div>
      </section>
    </>
  )
}