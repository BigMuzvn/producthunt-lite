import { useState, useEffect } from 'react'
import { getProducts } from '../services/product.service'
import ProductCard from './ProductCard'

function TopProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <p>Chargement des produits...</p>
  if (error) return <p>Erreur : {error}</p>

  return (
    <section id="top-products">
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">Top produits</p>
          <h2>Les plus populaires aujourd'hui</h2>
        </div>
        {products.map(product => (
          <ProductCard key={product._id} {...product} />
        ))}
      </div>
    </section>
  )
}

export default TopProducts