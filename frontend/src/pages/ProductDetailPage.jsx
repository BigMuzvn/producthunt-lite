import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductComments from '../components/ProductComments'
import ContactMakerModal from '../components/ContactMakerModal'
import AuthPromptModal from '../components/AuthPromptModal'
import { voteProduct, unvoteProduct, getProductById, getMyVotes } from '../services/product.service'
import { getToken } from '../services/auth.service'
import { useAuthGate } from '../hooks/useAuthGate'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [contactOpen, setContactOpen] = useState(false)
  const [lightboxImg, setLightboxImg] = useState(null)
  const [copied, setCopied] = useState(false)
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

  useEffect(() => {
    if (!loading && window.location.hash === '#comments') {
      const el = document.getElementById('comments') || document.querySelector('.product-comments-section')
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          const textarea = document.getElementById('comment-textarea')
          if (textarea) textarea.focus()
        }, 150)
      }
    }
  }, [loading, id])

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

  if (loading) {
    return (
      <div className="app-shell">
        <Header />
        <main className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Chargement des détails du produit...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="app-shell">
        <Header />
        <main className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <h2 style={{ color: '#FFFFFF', marginBottom: 12 }}>Produit introuvable</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{error || 'Ce produit n’existe pas.'}</p>
          <Link to="/products" className="btn btn-primary">Retour aux produits</Link>
        </main>
        <Footer />
      </div>
    )
  }

  const makerObj = typeof product.makerId === 'object' ? product.makerId : null
  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : []

  return (
    <div className="app-shell">
      <Header />

      <main className="product-detail-page">
        <div className="container">
          <Link to="/products" className="detail-back-link">← Retour aux produits</Link>

          <div className="detail-header">
            <img
              src={product.logoUrl || 'https://placehold.co/80/1e293b/ffffff?text=' + encodeURIComponent(product.name?.charAt(0) || 'P')}
              alt={product.name}
              className="detail-logo"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/80/1e293b/ffffff?text=' + encodeURIComponent(product.name?.charAt(0) || 'P')
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h1>{product.name}</h1>
                {product.categoryId?.name && (
                  <span className="category-tag">
                    <span className="category-dot" style={{ background: product.categoryId.color || '#38BDF8' }} />
                    {product.categoryId.name}
                  </span>
                )}
                <span className={`product-status-pill status-${(product.status || 'LIVE').toLowerCase()}`}>
                  <span className="status-dot" />
                  {product.status === 'BETA' ? 'Bêta Ouverte' : product.status === 'OPEN_SOURCE' ? 'Open Source' : 'En Ligne'}
                </span>
                {(product.createdAt || product.launchDate) && (Date.now() - new Date(product.createdAt || product.launchDate).getTime()) < 48 * 3600 * 1000 && (
                  <span className="recent-launch-pill">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Lancement récent
                  </span>
                )}
              </div>
              <p className="detail-tagline">{product.tagline}</p>

              {makerObj?.name && (
                <p className="detail-maker-byline">
                  par{' '}
                  <Link to={`/maker/${makerObj._id}`} className="maker-link">
                    {makerObj.name} ↗
                  </Link>
                </p>
              )}
            </div>

            <button
              className={`votes-badge detail-votes ${voted ? 'voted' : ''}`}
              onClick={handleVoteClick}
            >
              <span>▲</span>
              <span>{product.votesCount}</span>
            </button>
          </div>

          {/* Carrousel / Galerie de Captures d'écran */}
          {images.length > 0 && (
            <div className="detail-gallery-section">
              <h3 className="gallery-title">Captures d'écran & Aperçus</h3>
              <div className="detail-gallery-scroll">
                {images.map((imgUrl, i) => (
                  <div key={i} className="gallery-thumb-wrapper" onClick={() => setLightboxImg(imgUrl)}>
                    <img src={imgUrl} alt={`${product.name} screenshot ${i + 1}`} className="gallery-thumb" />
                    <span className="gallery-expand-hint">🔍 Agrandir</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="detail-content-box">
            <h3 style={{ fontSize: 16, color: '#FFFFFF', marginBottom: 12 }}>À propos de ce produit</h3>
            <p className="detail-description">{product.description}</p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginTop: 24 }}>
              <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-glow">
                Visiter le site officiel ↗
              </a>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setContactOpen(true)}
              >
                Contacter le créateur
              </button>

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
          </div>

          <ProductComments productId={id} productMakerId={makerObj?._id || product.makerId} />
        </div>
      </main>

      {/* Modale Lightbox Image Plein Écran */}
      {lightboxImg && (
        <div className="settings-overlay" onClick={() => setLightboxImg(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={lightboxImg} alt="Screenshot plein écran" className="lightbox-img" />
            <button className="settings-close lightbox-close" onClick={() => setLightboxImg(null)}>✕</button>
          </div>
        </div>
      )}

      {/* Modale de Contact */}
      {contactOpen && makerObj && (
        <ContactMakerModal
          maker={makerObj}
          onClose={() => setContactOpen(false)}
        />
      )}

      {promptOpen && (
        <AuthPromptModal
          message="Connecte-toi pour voter pour ce produit."
          onLogin={goToLogin}
          onClose={closePrompt}
        />
      )}

      <Footer />
    </div>
  )
}