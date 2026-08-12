import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUser } from '../services/auth.service'
import { getNotifications, markNotificationsRead } from '../services/notification.service'
import SpotlightSearch from './SpotlightSearch'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [spotlightOpen, setSpotlightOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const notifRef = useRef(null)
  const navigate = useNavigate()
  const user = getUser()
  const isAdminAccount = user?.isAdmin || user?.isSuperAdmin

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleCustomOpen() {
      setSpotlightOpen(true)
    }
    window.addEventListener('open-spotlight', handleCustomOpen)
    return () => window.removeEventListener('open-spotlight', handleCustomOpen)
  }, [])

  useEffect(() => {
    if (user) {
      loadNotifications()
      const interval = setInterval(loadNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user?._id])

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function loadNotifications() {
    try {
      const res = await getNotifications()
      setNotifications(res.notifications || [])
      setUnreadCount(res.unreadCount || 0)
    } catch {
      // Silent error fallback
    }
  }

  async function handleMarkRead() {
    try {
      await markNotificationsRead()
      setUnreadCount(0)
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch {
      // Silent error fallback
    }
  }

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-inner">
          <Link to="/" className="logo-link" onClick={closeMenu}>
            <div className="logo-badge-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
              </svg>
            </div>
            <span className="logo-text-title">
              ProductHunt <span>LITE</span>
            </span>
          </Link>

          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle navigation">
            {isMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12"/>
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="4" y1="18" x2="20" y2="18"/>
              </svg>
            )}
          </button>

          <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
            <nav className="nav-links">
              <Link to="/" onClick={closeMenu}>Accueil</Link>
              <Link to="/products" onClick={closeMenu}>Produits</Link>
              <Link to="/categories" onClick={closeMenu}>Catégories</Link>
              <Link to="/about" onClick={closeMenu}>À propos</Link>
              <Link to="/contact" onClick={closeMenu}>Contact</Link>
            </nav>

            <div className="nav-assistants">
              {/* Bouton Recherche Spotlight Cmd+K */}
              <button
                type="button"
                className="header-search-btn"
                onClick={() => setSpotlightOpen(true)}
                title="Rechercher (Cmd + K)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="search-btn-label">Cmd + K</span>
              </button>

              {/* Cloche de Notifications In-App */}
              {user && (
                <div className="notif-dropdown-wrapper" ref={notifRef}>
                  <button
                    type="button"
                    className="notif-bell-btn"
                    onClick={() => setNotifOpen(!notifOpen)}
                    title="Notifications"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                  </button>

                  {notifOpen && (
                    <div className="notif-panel">
                      <div className="notif-panel-header">
                        <strong>Notifications</strong>
                        {unreadCount > 0 && (
                          <button type="button" className="notif-read-all" onClick={handleMarkRead}>
                            Tout marquer comme lu
                          </button>
                        )}
                      </div>

                      <div className="notif-panel-body">
                        {notifications.length === 0 && (
                          <p className="notif-empty">Aucune notification pour le moment.</p>
                        )}

                        {notifications.map(n => (
                          <div
                            key={n._id}
                            className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                            onClick={() => {
                              setNotifOpen(false)
                              if (n.productId?._id) navigate(`/products/${n.productId._id}`)
                            }}
                          >
                            <div className="notif-icon">
                              {n.type === 'VOTE' ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#818CF8' }}>
                                  <polygon points="12 2 2 22 22 22" />
                                </svg>
                              ) : n.type === 'COMMENT' ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#38BDF8' }}>
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#34D399' }}>
                                  <polyline points="9 17 4 12 9 7" />
                                  <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                                </svg>
                              )}
                            </div>
                            <div className="notif-content">
                              <p className="notif-msg">{n.message}</p>
                              <span className="notif-time">{new Date(n.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="nav-actions">
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {!isAdminAccount && (
                    <Link to="/submit" className="btn btn-secondary" onClick={closeMenu} style={{ padding: '8px 16px', fontSize: 13, gap: 6 }}>
                      <span>+</span> Soumettre
                    </Link>
                  )}
                  {isAdminAccount ? (
                    <Link to="/admin" className="btn btn-primary" onClick={closeMenu} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      Admin
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="btn btn-primary" onClick={closeMenu} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </span>
                      {user.name}
                    </Link>
                  )}
                </div>
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

      {/* Modal Spotlight Search */}
      <SpotlightSearch isOpen={spotlightOpen} onClose={() => setSpotlightOpen(false)} />
    </>
  )
}

export default Header