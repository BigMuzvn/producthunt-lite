import { useState, useEffect } from 'react'
import { getProducts, getMyVotes } from '../services/product.service'
import { getToken } from '../services/auth.service'
import ProductCard from './ProductCard'
import ProductSkeleton from './ProductSkeleton'

function TopProducts() {
  const [products, setProducts] = useState([])
  const [votedIds, setVotedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProducts()
        setProducts(data.slice(0, 10))

        if (getToken()) {
          const myVotes = await getMyVotes()
          setVotedIds(new Set(myVotes))
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <section id="top-products">
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">Top produits</p>
          <h2>Les plus populaires aujourd'hui</h2>
        </div>
        {loading && <ProductSkeleton count={3} />}
        {error && <p>Erreur : {error}</p>}
        {!loading && !error && products.map(product => (
          <ProductCard key={product._id} {...product} initiallyVoted={votedIds.has(product._id)} />
        ))}
      </div>
    </section>
  )
}

export default TopProducts