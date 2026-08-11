import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import SettingsModal from '../components/SettingsModal'
import '../components/SettingsModal.css'
import { getUser, logout } from '../services/auth.service'
import { getMyProducts, deleteProduct } from '../services/product.service'
import './DashboardPage.css'

export default function DashboardPage() {
  const user = getUser()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    document.title = 'Mon Dashboard — ProductHunt Lite'
    getMyProducts().then(setProducts).catch(() => {}).finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce produit ?')) return
    await deleteProduct(id)
    setProducts(products.filter(p => p._id !== id))
  }

  const totalVotes = products.reduce((sum, p) => sum + p.votesCount, 0)

  return (
    <>
      <Header />
      <div className="dash-page">
        <div className="container">
          <div className="dash-top">
            <div>
              <p className="dash-eyebrow">Espace membre</p>
              <h1 className="dash-title">Bienvenue{user ? `, ${user.name}` : ''} 👋</h1>
            </div>
            <div className="dash-actions">
              <Link to="/submit" className="btn btn-primary">+ Soumettre un produit</Link>
              <button className="btn btn-secondary" onClick={() => setShowSettings(true)}>Paramètres</button>
              <button className="btn btn-secondary" onClick={handleLogout}>Se déconnecter</button>
            </div>
          </div>

          <div className="dash-stats">
            <div className="dash-stat-card">
              <span className="dash-stat-value">{products.length}</span>
              <span className="dash-stat-label">Produits soumis</span>
            </div>
            <div className="dash-stat-card">
              <span className="dash-stat-value">{totalVotes}</span>
              <span className="dash-stat-label">Votes reçus au total</span>
            </div>
            <div className="dash-stat-card">
              <span className="dash-stat-value">{user?.email || '—'}</span>
              <span className="dash-stat-label">Compte connecté</span>
            </div>
          </div>

          <h3 className="dash-section-title">Mes produits</h3>

          {loading && <p className="dash-empty">Chargement...</p>}
          {!loading && products.length === 0 && (
            <div className="dash-empty-card">
              <p>Tu n'as encore soumis aucun produit.</p>
              <Link to="/submit" className="btn btn-primary">Soumettre mon premier produit</Link>
            </div>
          )}

          <div className="dash-product-list">
            {products.map(p => (
              <div key={p._id} className="dash-product-row">
                <img src={p.logoUrl || 'https://placehold.co/48'} alt={p.name} className="dash-product-logo" />
                <div className="dash-product-info">
                  <h4>{p.name}</h4>
                  <p>{p.tagline}</p>
                  {p.categoryId?.name && (
                    <span className="category-tag">
                      <span className="category-dot" style={{ background: p.categoryId.color }}></span>
                      {p.categoryId.name}
                    </span>
                  )}
                </div>
                <span className="votes-badge">▲ {p.votesCount}</span>
                <Link to={`/products/${p._id}/edit`} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }}>
                  Modifier
                </Link>
                <button onClick={() => handleDelete(p._id)} className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: 13, color: '#B3261E' }}>
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}