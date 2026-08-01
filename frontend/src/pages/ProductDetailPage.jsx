import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { voteProduct, unvoteProduct, getProductById, getMyVotes } from '../services/product.service'
import { getToken } from '../services/auth.service'
import { useAuthGate } from '../hooks/useAuthGate'
import AuthPromptModal from '../components/AuthPromptModal'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { promptOpen, requireAuth, goToLogin, closePrompt } = useAuthGate()

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(id)
        setProduct(data)

        if (getToken()) {
          const myVotes = await getMyVotes()
          setVoted(myVotes.includes(id))
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  async function toggleVote() {
  try {
    if (voted) {
      const updated = await unvoteProduct(id)
      setProduct({ ...product, votesCount: updated.votesCount })
      setVoted(false)
    } else {
      const updated = await voteProduct(id)
      setProduct({ ...product, votesCount: updated.votesCount })
      setVoted(true)
    }
  } catch (err) {
    console.error(err.message)
  }
}

function handleVoteClick() {
  requireAuth(toggleVote)
}

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
          <button
            className={`votes-badge detail-votes ${voted ? 'voted' : ''}`}
            onClick={handleVoteClick}
          >
            <span>▲</span>
            <span>{product.votesCount}</span>
          </button>
        </div>

        <div className="detail-meta">
          <span className="category-tag">
            <span className="category-dot" style={{ background: product.categoryId?.color }}></span>
            {product.categoryId?.name}
          </span>
          <span className="detail-maker">Par {product.makerId?.name}</span>
        </div>

        <p className="detail-description">{product.description}</p>

        <div style={{ display: 'flex', gap: 10 }}>
          <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Visiter le site
          </a>
          {product.contactUrl && (
            <a href={product.contactUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              Contacter le créateur
            </a>
          )}
        </div>
      </div>

      {promptOpen && (
        <AuthPromptModal
          message="Connecte-toi pour voter pour ce produit."
          onLogin={goToLogin}
          onClose={closePrompt}
        />
      )}
    </div>
  )
}