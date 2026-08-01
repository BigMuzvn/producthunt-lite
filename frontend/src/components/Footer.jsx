import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">ProductHunt Lite</Link>
          <p className="footer-tagline">
            La chasse aux meilleurs produits tech, triée chaque jour par la communauté.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
              </svg>
            </a>
            <a href="#" aria-label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.92.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Produit</h4>
          <Link to="/products">Explorer les produits</Link>
          <Link to="/categories">Catégories</Link>
          <Link to="/submit">Soumettre un produit</Link>
        </div>

        <div className="footer-col">
          <h4>Ressources</h4>
          <Link to="/#how-it-works">Comment ça marche</Link>
          <Link to="/#faq">FAQ</Link>
          <Link to="/dashboard">Mon dashboard</Link>
        </div>

        <div className="footer-col">
          <h4>Légal</h4>
          <a href="#">Conditions</a>
          <a href="#">Confidentialité</a>
          <a href="#">Contact</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© 2026 ProductHunt Lite. Tous droits réservés.</span>
          <span className="footer-credit">Projet étudiant — construit avec React & Node.js</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer