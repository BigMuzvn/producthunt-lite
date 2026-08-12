import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthGate } from '../hooks/useAuthGate'
import AuthPromptModal from './AuthPromptModal'

function FinalCTA() {
  const navigate = useNavigate()
  const { promptOpen, requireAuth, goToLogin, closePrompt } = useAuthGate()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubmitClick() {
    requireAuth(() => navigate('/submit'))
  }

  function handleNewsletterSubmit(e) {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setTimeout(() => {
      setEmail('')
    }, 4000)
  }

  return (
    <section className="final-cta-section">
      <div className="final-cta-ambient-glow"></div>

      <div className="container">
        <div className="final-cta-card">
          <div className="final-cta-grid">
            {/* Colonne Gauche : Appel à l'action Principal */}
            <div className="final-cta-left">
              <div className="hero-pill-badge" style={{ marginBottom: 20 }}>
                <span className="pill-dot-pulse"></span>
                <span>Prêt à passer au niveau supérieur ?</span>
              </div>

              <h2 className="final-cta-title">
                Propulsez votre projet devant <br />
                <span className="hero-gradient-text">5,000+ créateurs</span> & passionnés.
              </h2>

              <p className="final-cta-desc">
                Rejoignez la plus grande communauté tech francophone. Soumettez votre produit en quelques minutes et obtenez vos premiers utilisateurs dès aujourd'hui.
              </p>

              <div className="final-cta-buttons">
                <button className="btn btn-primary btn-glow" onClick={handleSubmitClick}>
                  + Soumettre mon produit
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/products')}>
                  Explorer le catalogue
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 4 }}>
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              </div>

              <div className="final-cta-guarantees">
                <div className="guarantee-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10B981' }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>100% Gratuit & Sans engagement</span>
                </div>
                <div className="guarantee-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10B981' }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Visibilité instantanée</span>
                </div>
                <div className="guarantee-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10B981' }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Dashboard de suivi inclus</span>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Boîte Newsletter Intelligente */}
            <div className="final-cta-right">
              <div className="newsletter-box-pro">
                <div className="newsletter-box-header">
                  <div className="newsletter-box-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="newsletter-box-title">La Veille Tech Hebdomadaire</h3>
                    <span className="newsletter-box-tag">Chaque dimanche matin</span>
                  </div>
                </div>

                <p className="newsletter-box-desc">
                  Recevez le Top 5 des pépites élues par la communauté et des analyses de tendances produit exclusives.
                </p>

                {subscribed ? (
                  <div className="newsletter-success-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10B981' }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>Merci ! Vous êtes bien inscrit à la veille tech.</span>
                  </div>
                ) : (
                  <form className="newsletter-form-pro" onSubmit={handleNewsletterSubmit}>
                    <div className="newsletter-input-group">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                      <input
                        type="email"
                        placeholder="votre.email@startup.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px', fontSize: 14 }}>
                      S'abonner
                    </button>
                  </form>
                )}

                <div className="newsletter-box-footer">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span>Zéro spam. Désinscription possible en un clic.</span>
                </div>
              </div>
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

export default FinalCTA
