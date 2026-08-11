import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { voteProduct, unvoteProduct } from '../services/product.service'
import { useAuthGate } from '../hooks/useAuthGate'
import AuthPromptModal from './AuthPromptModal'

function ProductCard({ _id, name, tagline, logoUrl, votesCount, initiallyVoted = false }) {
  const [votes, setVotes] = useState(votesCount)
  const [voted, setVoted] = useState(initiallyVoted)
  const navigate = useNavigate()
  const { promptOpen, requireAuth, goToLogin, closePrompt } = useAuthGate()

  function handleCardClick() {
    navigate(`/products/${_id}`)
  }

  async function toggleVote() {
    try {
      if (voted) {
        const updated = await unvoteProduct(_id)
        setVotes(updated.votesCount)
        setVoted(false)
      } else {
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
    requireAuth(toggleVote)
  }

  return (
    <>
      <article className="product-card">
        <div className="product-body" onClick={handleCardClick}>
          <img src={logoUrl || 'https://placehold.co/48'} alt={name} className="product-logo" loading="lazy" />
          <div className="product-info">
            <h3>{name}</h3>
            <p>{tagline}</p>
          </div>
        </div>
        <button className={`votes-badge ${voted ? 'voted' : ''}`} onClick={handleVoteClick}>
          <span>▲</span>
          <span>{votes}</span>
        </button>
      </article>

      {promptOpen && (
        <AuthPromptModal
          message="Connecte-toi pour voter pour ce produit."
          onLogin={goToLogin}
          onClose={closePrompt}
        />
      )}
    </>
  )
}

export default ProductCard