import { useNavigate } from 'react-router-dom'

function ExploreCTA() {
  const navigate = useNavigate()
  function handleExploreClick() {
    navigate('/products')
  }

  return (
    <section className="explore-cta">
      <div className="container explore-cta-inner">
        <div>
          <h2>Envie de voir tous les produits ?</h2>
          <p>Crée un compte gratuit pour explorer le catalogue complet et voter pour tes favoris.</p>
        </div>
        <div className="explore-cta-actions">
          <button className="btn btn-primary" onClick={handleExploreClick}>
            Explorer tout le catalogue
          </button>
          <button className="cta-arrow-btn" onClick={handleExploreClick} aria-label="Explorer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default ExploreCTA