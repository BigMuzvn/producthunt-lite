import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { voteProduct, unvoteProduct, getProductById, getMyVotes } from '../services/product.service'
import { getToken } from '../services/auth.service'
import { useAuthGate } from '../hooks/useAuthGate'
import AuthPromptModal from '../components/AuthPromptModal'
import ProductComments from '../components/ProductComments'
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
        if (data?.name) {
          document.title = `${data.name} — ProductHunt Lite`
        }

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

  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const shareData = {
      title: product.name,
      text: `${product.name} — ${product.tagline}`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err)
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      } catch (err) {
        console.error('Erreur copie presse-papier:', err)
      }
    }
  }

  if (loading) return <p className="detail-status">Chargement...</p>
  if (error) return <p className="detail-status">Erreur : {error}</p>
  if (!product) return null

  return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/" className="detail-back-link">← Retour aux produits</Link>

        <div className="detail-header">
          <img src={product.logoUrl || 'https://placehold.co/80'} alt={product.name} className="detail-logo" loading="lazy" />
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

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Visiter le site ↗
          </a>
          {product.contactUrl && (
            <a href={product.contactUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              Contacter le créateur
            </a>
          )}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleShare}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            {copied ? '✓ Lien copié !' : 'Partager'}
          </button>
        </div>

        <ProductComments productId={id} productMakerId={product.makerId?._id || product.makerId} />
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