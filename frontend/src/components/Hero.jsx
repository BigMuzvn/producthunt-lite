import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthGate } from '../hooks/useAuthGate'
import AuthPromptModal from './AuthPromptModal'

function Hero() {
  const navigate = useNavigate()
  const { promptOpen, requireAuth, goToLogin, closePrompt } = useAuthGate()
  const [query, setQuery] = useState('')

  function handleSubmitClick() {
    requireAuth(() => navigate('/submit'))
  }

  function handleSearch(e) {
    e.preventDefault()
    navigate(`/products?search=${encodeURIComponent(query)}`)
  }

  return (
    <section id="hero" className="hero">
      <div className="container hero-inner">
        <h1>La chasse aux meilleurs produits tech.</h1>
        <p>Chaque jour, les nouveautés tech les plus prometteuses, triées par la communauté.</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate('/products')}>Explorer les produits</button>
          <button className="btn btn-secondary" onClick={handleSubmitClick}>Soumettre un produit</button>
        </div>

        <form className="hero-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Rechercher</button>
        </form>
      </div>

      {promptOpen && (
        <AuthPromptModal
          message="Connecte-toi pour soumettre un produit."
          onLogin={goToLogin}
          onClose={closePrompt}
        />
      )}
    </section>
  )
}

export default Hero