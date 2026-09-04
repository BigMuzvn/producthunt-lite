import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { voteProduct, unvoteProduct } from '../services/product.service'
import { toggleBookmark } from '../services/auth.service'
import { useAuthGate } from '../hooks/useAuthGate'
import AuthPromptModal from './AuthPromptModal'
import './ProductCard.css'

function ProductCard({ _id, name, tagline, logoUrl, categoryId, makerId, votesCount, rank, status = 'LIVE', createdAt, launchDate, initiallyVoted = false, initiallyBookmarked = false }) {
  const [votes, setVotes] = useState(votesCount)
  const [voted, setVoted] = useState(initiallyVoted)
  const [bookmarked, setBookmarked] = useState(initiallyBookmarked)
  const [justVoted, setJustVoted] = useState(false)
  const navigate = useNavigate()
  const { promptOpen, requireAuth, goToLogin, closePrompt } = useAuthGate()

  const dateToUse = createdAt || launchDate
  const isRecentLaunch = dateToUse && (Date.now() - new Date(dateToUse).getTime()) < 48 * 3600 * 1000

  function handleCardClick() {
    navigate(`/products/${_id}`)
  }

  function handleCommentClick(e) {
    e.stopPropagation()
    navigate(`/products/${_id}#comments`)
  }

  async function handleToggleVote() {
    try {
      if (voted) {
        const updated = await unvoteProduct(_id)
        setVotes(updated.votesCount)
        setVoted(false)
      } else {
        setJustVoted(true)
        setTimeout(() => setJustVoted(false), 500)
        const updated = await voteProduct(_id)
        setVotes(updated.votesCount)
        setVoted(true)
      }
    } catch (err) {
      console.error(err.message)
    }
  }

  function handleVoteClick(event) {
    event.stopPropagation()
    requireAuth(handleToggleVote)
  }

  async function handleBookmarkClick(e) {
    e.stopPropagation()
    requireAuth(async () => {
      try {
        const res = await toggleBookmark(_id)
        setBookmarked(res.isBookmarked)
      } catch (err) {
        console.error(err.message)
      }
    })
  }

  const makerObj = makerId && typeof makerId === 'object' ? makerId : null
  const makerName = makerObj?.name || (typeof makerId === 'string' ? 'Maker' : '')

  return (
    <>
      <article className={`product-card ${rank === 1 ? 'rank-gold-card' : rank === 2 ? 'rank-silver-card' : rank === 3 ? 'rank-bronze-card' : ''}`}>
        {rank && rank <= 3 && (
          <div className={`podium-ribbon rank-${rank}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>{rank === 1 ? '#1 PRODUIT DU JOUR' : rank === 2 ? '#2 PRODUIT DU JOUR' : '#3 PRODUIT DU JOUR'}</span>
          </div>
        )}

        <div className="product-body" onClick={handleCardClick}>
          <img
            src={logoUrl || 'https://placehold.co/56/1e293b/ffffff?text=' + encodeURIComponent(name?.charAt(0) || 'P')}
            alt={name}
            className="product-logo"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/56/1e293b/ffffff?text=' + encodeURIComponent(name?.charAt(0) || 'P')
            }}
          />
          <div className="product-info">
            <div className="product-header-line">
              <h3 className="product-name">{name}</h3>
              {categoryId && categoryId.name && categoryId.status !== 'pending' && (
                <span className="product-category-pill">
                  <span
                    className="product-category-dot"
                    style={{ background: categoryId.color || '#6366F1' }}
                  />
                  {categoryId.name}
                </span>
              )}

              {/* Badges de Statut (Live / Beta / Open Source) */}
              <span className={`product-status-pill status-${(status || 'LIVE').toLowerCase()}`}>
                <span className="status-dot" />
                {status === 'BETA' ? 'Bêta Ouverte' : status === 'OPEN_SOURCE' ? 'Open Source' : 'En Ligne'}
              </span>

              {/* Badge Lancement récent (<48h) */}
              {isRecentLaunch && (
                <span className="recent-launch-pill" title="Produit lancé au cours des dernières 48 heures">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Récent
                </span>
              )}
            </div>

            <p className="product-tagline">{tagline}</p>

            {makerName && (
              <p className="product-maker-byline" onClick={(e) => e.stopPropagation()}>
                par{' '}
                {makerObj?._id ? (
                  <Link to={`/maker/${makerObj._id}`} className="maker-link">
                    {makerName}
                  </Link>
                ) : (
                  <span className="maker-link-disabled">{makerName}</span>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="product-actions">
          <button
            type="button"
            className={`product-bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmarkClick}
            title={bookmarked ? 'Retirer des favoris' : 'Enregistrer dans les favoris'}
            aria-label="Sauvegarder le produit"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          <button
            type="button"
            className="product-comment-btn"
            onClick={handleCommentClick}
            title="Laisser un avis ou voir les discussions"
            aria-label={`Commentaires pour ${name}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span className="comment-btn-label">Avis</span>
          </button>

          <button
            type="button"
            className={`votes-badge ${voted ? 'voted' : ''} ${justVoted ? 'vote-pop' : ''}`}
            onClick={handleVoteClick}
            aria-label={`Voter pour ${name} (${votes} votes)`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 2 }}>
              <polyline points="18 15 12 9 6 15" />
            </svg>
            <span>{votes}</span>
          </button>
        </div>
      </article>

      {promptOpen && (
        <AuthPromptModal
          message="Connecte-toi pour voter ou enregistrer ce produit."
          onLogin={goToLogin}
          onClose={closePrompt}
        />
      )}
    </>
  )
}

export default ProductCard