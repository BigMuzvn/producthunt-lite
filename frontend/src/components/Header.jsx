import { useState } from 'react'
import { Link } from 'react-router-dom'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <strong className="logo">  <img src="/src/assets/logo.png" alt="ProductHunt Lite" /></strong>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? 'Fermer' : 'Menu'}
        </button>

        <nav className={isMenuOpen ? 'nav-links nav-links-open' : 'nav-links'}>
          <a href="#top-products">Produits</a>
          <a href="#categories">Catégories</a>
          <a href="#how-it-works">CCM</a>
          <a href="#">Communauté</a>
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="btn btn-secondary">Se connecter</Link>
          <Link to="/signup" className="btn btn-primary">S'inscrire</Link>
        </div>
      </div>
    </header>
  )
}

export default Header