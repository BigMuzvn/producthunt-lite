import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthGate } from '../hooks/useAuthGate'
import AuthPromptModal from './AuthPromptModal'
import heroImg from '../assets/hero.png'

function Hero() {
  const navigate = useNavigate()
  const { promptOpen, requireAuth, goToLogin, closePrompt } = useAuthGate()
  const [query, setQuery] = useState('')
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const stageRef = useRef(null)

  function handleMouseMove(e) {
    if (!stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20
    setTilt({ x, y })
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
  }

  function handleSubmitClick() {
    requireAuth(() => navigate('/submit'))
  }

  function handleSearch(e) {
    e.preventDefault()
    navigate(`/products?search=${encodeURIComponent(query)}`)
  }

  return (
    <section id="hero" className="hero-section-3d">
      <div className="hero-ambient-glow hero-glow-1"></div>
      <div className="hero-ambient-glow hero-glow-2"></div>

      <div className="container hero-grid">
        {/* Colonne gauche : Contenu & Appel à l'action */}
        <div className="hero-content">
          <div className="hero-pill-badge">
            <span className="pill-dot-pulse"></span>
            <span>La plateforme #1 des lancements tech</span>
          </div>

          <h1 className="hero-headline">
            Propulsez vos projets. <br />
            <span className="hero-gradient-text">Découvrez le futur</span> de la tech.
          </h1>

          <p className="hero-description">
            Chaque jour, découvrez les innovations les plus audacieuses créées par la communauté, votez pour vos favoris et interagissez en direct avec les fondateurs.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary btn-glow" onClick={() => navigate('/products')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Explorer les produits
            </button>
            <button className="btn btn-secondary btn-glass" onClick={handleSubmitClick}>
              + Soumettre un produit
            </button>
          </div>

          <form className="hero-search-bar" onSubmit={handleSearch}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher une startup, une IA, un outil SaaS..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13, borderRadius: 8 }}>
              Rechercher
            </button>
          </form>

          <div className="hero-social-proof">
            <div className="avatar-stack">
              <span className="stack-avatar" style={{ background: '#6366F1' }}>A</span>
              <span className="stack-avatar" style={{ background: '#8B5CF6' }}>M</span>
              <span className="stack-avatar" style={{ background: '#38BDF8' }}>T</span>
              <span className="stack-avatar" style={{ background: '#10B981' }}>+</span>
            </div>
            <span className="proof-text">Rejoint par plus de <strong>5,000+ créateurs</strong> et passionnés de tech.</span>
          </div>
        </div>

        {/* Colonne droite : Scène 3D Interactive & Flottante */}
        <div
          className="hero-stage-wrapper"
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
          }}
        >
          <div className="stage-halo"></div>

          <div className="stage-image-container floating-3d">
            <img src={heroImg} alt="3D Tech Launch Platform" className="hero-3d-visual" />
          </div>

          {/* Badge Flottant 1 (Trophée SVG) */}
          <div className="floating-card floating-card-top float-card-delay-1">
            <div className="float-card-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--cyan)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                <path d="M4 22h16"/>
                <path d="M10 14.66V17c0 .55-.45 1-1 1H7"/>
                <path d="M14 14.66V17c0 .55.45 1 1 1h2"/>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
              </svg>
            </div>
            <div>
              <div className="float-card-title">Produit #1 du Jour</div>
              <div className="float-card-subtitle">+480 votes en 24h</div>
            </div>
          </div>

          {/* Badge Flottant 2 (Lightning SVG) */}
          <div className="floating-card floating-card-bottom float-card-delay-2">
            <div className="float-card-icon" style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div>
              <div className="float-card-title">100% Curated Tech</div>
              <div className="float-card-subtitle">Vérifié par la communauté</div>
            </div>
          </div>
        </div>
      </div>

      {promptOpen && (
        <AuthPromptModal
          message="Connecte-toi pour soumettre ton produit sur la plateforme."
          onLogin={goToLogin}
          onClose={closePrompt}
        />
      )}
    </section>
  )
}

export default Hero