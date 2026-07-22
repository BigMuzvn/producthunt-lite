import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductById } from '../services/product.service'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(id)
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) return <p className="detail-status">Chargement...</p>
  if (error) return <p className="detail-status">Erreur : {error}</p>
  if (!product) return null

  return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/" className="detail-back-link">← Retour aux produits</Link>

        <div className="detail-header">
          <img src={product.logoUrl} alt={product.name} className="detail-logo" />
          <div>
            <h1>{product.name}</h1>
            <p className="detail-tagline">{product.tagline}</p>
          </div>
          <span className="votes-badge detail-votes">▲ {product.votesCount}</span>
        </div>

        <div className="detail-meta">
          <span className="category-tag">
            <span className="category-dot" style={{ background: product.categoryId?.color }}></span>
            {product.categoryId?.name}
          </span>
          <span className="detail-maker">Par {product.makerId?.name}</span>
        </div>

        <p className="detail-description">{product.description}</p>

        <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Visiter le site
        </a>
      </div>
    </div>
  )
}