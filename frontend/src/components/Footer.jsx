import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        {/* Brand & Mission Banner */}
        <div className="footer-top-brand">
          <div className="footer-brand-left">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                </svg>
              </div>
              <span className="footer-logo-title">
                ProductHunt <span>LITE</span>
              </span>
            </Link>
            <p className="footer-tagline">
              La plateforme de référence pour découvrir, voter et propulser les meilleures innovations technologiques créées par la communauté des makers.
            </p>
            <div className="footer-status-badge">
              <span className="status-indicator-dot"></span>
              <span>Tous les systèmes sont opérationnels</span>
            </div>
          </div>

          <div className="footer-socials-group">
            <span className="footer-socials-label">Suivez l'écosystème</span>
            <div className="footer-socials-list">
              <a href="#" aria-label="X (Twitter)" title="X / Twitter" className="footer-social-btn" onClick={(e) => e.preventDefault()}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" title="LinkedIn" className="footer-social-btn" onClick={(e) => e.preventDefault()}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub" className="footer-social-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.92.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2z"/>
                </svg>
              </a>
              <a href="#" aria-label="Discord" title="Discord Community" className="footer-social-btn" onClick={(e) => e.preventDefault()}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Professional SaaS Columns */}
        <div className="footer-nav-grid">
          {/* Col 1: Produit */}
          <div className="footer-nav-column">
            <h4 className="footer-column-title">
              <span className="column-title-dot accent-dot"></span>
              Produits
            </h4>
            <ul className="footer-links-list">
              <li><Link to="/products" className="footer-nav-link">Explorer les produits</Link></li>
              <li><Link to="/categories" className="footer-nav-link">Catégories & Thèmes</Link></li>
              <li><Link to="/submit" className="footer-nav-link">Soumettre un projet</Link></li>
              <li><Link to="/products" className="footer-nav-link">Classement de la semaine</Link></li>
              <li>
                <a href="#changelog" className="footer-nav-link dead-link" onClick={(e) => e.preventDefault()}>
                  Nouveautés & Changelog
                  <span className="footer-tag-micro">v2.4</span>
                </a>
              </li>
              <li><a href="#roadmap" className="footer-nav-link dead-link" onClick={(e) => e.preventDefault()}>Roadmap publique</a></li>
            </ul>
          </div>

          {/* Col 2: Ressources */}
          <div className="footer-nav-column">
            <h4 className="footer-column-title">
              <span className="column-title-dot cyan-dot"></span>
              Ressources
            </h4>
            <ul className="footer-links-list">
              <li><a href="#docs" className="footer-nav-link dead-link" onClick={(e) => e.preventDefault()}>Documentation API</a></li>
              <li><a href="#guides" className="footer-nav-link dead-link" onClick={(e) => e.preventDefault()}>Guide du Lancement</a></li>
              <li><Link to="/#faq" className="footer-nav-link">Foire aux questions (FAQ)</Link></li>
              <li><a href="#community" className="footer-nav-link dead-link" onClick={(e) => e.preventDefault()}>Club des Créateurs</a></li>
              <li>
                <a href="#status" className="footer-nav-link dead-link" onClick={(e) => e.preventDefault()}>
                  Statut de l'infrastructure
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Entreprise */}
          <div className="footer-nav-column">
            <h4 className="footer-column-title">
              <span className="column-title-dot emerald-dot"></span>
              Entreprise
            </h4>
            <ul className="footer-links-list">
              <li><Link to="/contact" className="footer-nav-link highlight-link">Nous contacter</Link></li>
              <li><Link to="/dashboard" className="footer-nav-link">Espace Dashboard</Link></li>
              <li><Link to="/about" className="footer-nav-link">À propos du projet</Link></li>
              <li>
                <a href="#careers" className="footer-nav-link dead-link" onClick={(e) => e.preventDefault()}>
                  Recrutement & Talents
                  <span className="footer-tag-hiring">Join us</span>
                </a>
              </li>
              <li><a href="#press" className="footer-nav-link dead-link" onClick={(e) => e.preventDefault()}>Kit Média & Presse</a></li>
            </ul>
          </div>

          {/* Col 4: Légal & Conformité */}
          <div className="footer-nav-column">
            <h4 className="footer-column-title">
              <span className="column-title-dot amber-dot"></span>
              Légal & Sécurité
            </h4>
            <ul className="footer-links-list">
              <li><a href="#mentions-legales" className="footer-nav-link dead-link" onClick={(e) => e.preventDefault()}>Mentions Légales</a></li>
              <li><a href="#confidentialite" className="footer-nav-link dead-link" onClick={(e) => e.preventDefault()}>Politique de Confidentialité</a></li>
              <li><a href="#cgu" className="footer-nav-link dead-link" onClick={(e) => e.preventDefault()}>Conditions d'Utilisation (CGU)</a></li>
              <li><a href="#cookies" className="footer-nav-link dead-link" onClick={(e) => e.preventDefault()}>Gestion des Cookies & RGPD</a></li>
              <li><a href="#security" className="footer-nav-link dead-link" onClick={(e) => e.preventDefault()}>Sécurité & Signalement</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <span>© {new Date().getFullYear()} ProductHunt Lite. Tous droits réservés.</span>
            <span className="footer-bullet">•</span>
            <span className="footer-mission-text">Conçu pour les fondateurs, développeurs et esprits innovants.</span>
          </div>
          <div className="footer-bottom-right">
            <div className="footer-tech-stack">
              <span className="tech-badge">React 18</span>
              <span className="tech-badge">Node.js</span>
              <span className="tech-badge">Express</span>
              <span className="tech-badge">MongoDB</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer