import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getUser } from '../services/auth.service'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const user = getUser()
  const isAdminAccount = user?.isAdmin || user?.isSuperAdmin

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/src/assets/logo.png" alt="ProductHunt Lite" />
        </Link>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <img src={isMenuOpen ? '/src/assets/cross.png' : '/src/assets/list.png'} alt="Menu" />
        </button>

        <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
          <nav className="nav-links">
            <Link to="/" onClick={closeMenu}>Home</Link>
            <Link to="/products" onClick={closeMenu}>Produits</Link>
            <Link to="/categories" onClick={closeMenu}>Catégories</Link>
            <Link to="/#how-it-works" onClick={closeMenu}>Comment ça marche</Link>
          </nav>

          <div className="nav-assistants">
            <Link to="/#contact" className="botass" onClick={closeMenu}>
              <img src="/src/assets/bot.png" alt="Assistant" />
            </Link>
            <Link to="/#contact" className="botass" onClick={closeMenu}>
              <img src="/src/assets/clients.png" alt="Clients" />
            </Link>
            <Link to="/#contact" className="botass" onClick={closeMenu}>
              <img src="/src/assets/github.png" alt="Github" />
            </Link>
          </div>

          <div className="nav-actions">
            {user ? (
              isAdminAccount ? (
                <Link to="/admin" className="btn btn-primary" onClick={closeMenu}>Administrateur</Link>
              ) : (
                <Link to="/dashboard" className="btn btn-primary" onClick={closeMenu}>{user.name}</Link>
              )
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" onClick={closeMenu}>Se connecter</Link>
                <Link to="/signup" className="btn btn-primary" onClick={closeMenu}>S'inscrire</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header