import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getStats, getAllUsers, deleteUser, toggleAdmin, createAdmin } from '../services/admin.service'
import { getProducts } from '../services/product.service'
import { adminDeleteProduct } from '../services/admin.service'
import { getCategories } from '../services/category.service'
import { adminDeleteCategory } from '../services/admin.service'
import { getUser, logout, changeEmail } from '../services/auth.service'
import './AdminPage.css'

export default function AdminPage() {
  const navigate = useNavigate()
  const currentUser = getUser()

  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [detailsUser, setDetailsUser] = useState(null)
  const [newAdminForm, setNewAdminForm] = useState({ name: '', email: '', password: '' })
  const [profileForm, setProfileForm] = useState({ name: currentUser?.name || '', email: currentUser?.email || '', currentPassword: '' })
  const [adminMessage, setAdminMessage] = useState('')
  const [adminError, setAdminError] = useState('')

  useEffect(() => {
    async function loadAll() {
      setLoading(true)
      try {
        const [s, u, p, c] = await Promise.all([
          getStats(),
          getAllUsers(),
          getProducts(),
          getCategories()
        ])
        setStats(s)
        setUsers(u)
        setProducts(p)
        setCategories(c)
      } catch (err) {
        console.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAll()
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  async function handleDeleteUser(id) {
    if (!confirm('Supprimer cet utilisateur et tous ses produits/votes ?')) return
    await deleteUser(id)
    setUsers(users.filter(u => u._id !== id))
  }

  async function handleToggleAdmin(id) {
    await toggleAdmin(id)
    setUsers(users.map(u => u._id === id ? { ...u, isAdmin: !u.isAdmin } : u))
  }

  async function handleDeleteProduct(id) {
    if (!confirm('Supprimer ce produit ?')) return
    await adminDeleteProduct(id)
    setProducts(products.filter(p => p._id !== id))
  }

  async function handleDeleteCategory(id) {
    if (!confirm('Supprimer cette catégorie ?')) return
    try {
      await adminDeleteCategory(id)
      setCategories(categories.filter(c => c._id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleCreateAdminSubmit(e) {
    e.preventDefault()
    setAdminMessage('')
    setAdminError('')
    try {
      await createAdmin(newAdminForm.name, newAdminForm.email, newAdminForm.password)
      setAdminMessage('Compte admin créé avec succès.')
      setNewAdminForm({ name: '', email: '', password: '' })
      const updatedUsers = await getAllUsers()
      setUsers(updatedUsers)
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleProfileSubmit(e) {
    e.preventDefault()
    setAdminMessage('')
    setAdminError('')
    try {
      if (profileForm.email !== currentUser.email) {
        await changeEmail(profileForm.email, profileForm.currentPassword)
      }
      setAdminMessage('Profil mis à jour avec succès.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  const clients = users.filter(u => !u.isAdmin && !u.isSuperAdmin)
  const admins = users.filter(u => u.isAdmin && !u.isSuperAdmin)
  const superAdmin = users.find(u => u.isSuperAdmin)

  const filteredClients = clients.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const detailsUserProducts = detailsUser
    ? products.filter(p => p.makerId?._id === detailsUser._id)
    : []

  if (loading) return <><Header /><p style={{ padding: 40 }}>Chargement...</p></>

  return (
    <>
      <Header />
      <div className="admin-page">
        <div className="container">
          <div className="admin-top">
            <h1 className="admin-title">Espace administrateur</h1>
            <button className="btn btn-secondary" onClick={handleLogout}>Se déconnecter</button>
          </div>

          <div className="admin-tabs">
            <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>Vue d'ensemble</button>
            <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Utilisateurs</button>
            <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Produits</button>
            <button className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Catégories</button>
            {currentUser?.isSuperAdmin && (
              <button className={tab === 'admins' ? 'active' : ''} onClick={() => setTab('admins')}>Administration</button>
            )}
          </div>

          {tab === 'overview' && stats && (
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <span className="admin-stat-value">{stats.totalUsers}</span>
                <span className="admin-stat-label">Utilisateurs</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-value">{stats.totalProducts}</span>
                <span className="admin-stat-label">Produits</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-value">{stats.totalCategories}</span>
                <span className="admin-stat-label">Catégories</span>
              </div>
              <div className="admin-stat-card">
                <span className="admin-stat-value">{stats.totalVotes}</span>
                <span className="admin-stat-label">Votes</span>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div>
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="admin-search"
              />
              <div className="admin-table">
                {filteredClients.map(u => (
                  <div key={u._id} className="admin-row">
                    <div className="admin-row-info">
                      <strong>{u.name}</strong>
                      <span className="admin-badge admin-badge-client">Client</span>
                      <p>{u.email}</p>
                      <p className="admin-row-meta">{u.productsCount} produit(s) — inscrit le {new Date(u.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="admin-row-actions">
                      <button className="btn btn-secondary" onClick={() => setDetailsUser(u)}>Détails</button>
                      <button className="btn btn-secondary" style={{ color: '#B3261E' }} onClick={() => handleDeleteUser(u._id)}>Supprimer</button>
                    </div>
                  </div>
                ))}
                {filteredClients.length === 0 && <p className="admin-empty">Aucun client trouvé.</p>}
              </div>
            </div>
          )}

          {tab === 'products' && (
            <div className="admin-table">
              {products.map(p => (
                <div key={p._id} className="admin-row">
                  <img src={p.logoUrl || 'https://placehold.co/40'} alt={p.name} className="admin-row-logo" />
                  <div className="admin-row-info">
                    <strong>{p.name}</strong>
                    <p>{p.tagline}</p>
                    <p className="admin-row-meta">{p.categoryId?.name} — {p.votesCount} votes — par {p.makerId?.name}</p>
                  </div>
                  <div className="admin-row-actions">
                    <button className="btn btn-secondary" style={{ color: '#B3261E' }} onClick={() => handleDeleteProduct(p._id)}>Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'categories' && (
            <div className="admin-table">
              {categories.map(c => (
                <div key={c._id} className="admin-row">
                  <div className="admin-row-info">
                    <span className="category-dot" style={{ background: c.color }}></span>
                    <strong>{c.name}</strong>
                  </div>
                  <div className="admin-row-actions">
                    <button className="btn btn-secondary" style={{ color: '#B3261E' }} onClick={() => handleDeleteCategory(c._id)}>Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'admins' && currentUser?.isSuperAdmin && (
            <div>
              <div className="admin-panels-grid">
                <div className="admin-panel">
                  <h3>Mon profil</h3>
                  <form onSubmit={handleProfileSubmit}>
                    <div className="form-field">
                      <label>Nom</label>
                      <input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required />
                    </div>
                    <div className="form-field">
                      <label>Email</label>
                      <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} required />
                    </div>
                    <div className="form-field">
                      <label>Mot de passe actuel (pour confirmer)</label>
                      <input type="password" value={profileForm.currentPassword} onChange={e => setProfileForm({ ...profileForm, currentPassword: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
                  </form>
                </div>

                <div className="admin-panel">
                  <h3>Ajouter un administrateur</h3>
                  <form onSubmit={handleCreateAdminSubmit}>
                    <div className="form-field">
                      <label>Nom</label>
                      <input value={newAdminForm.name} onChange={e => setNewAdminForm({ ...newAdminForm, name: e.target.value })} placeholder="ex: Jean Dupont" required />
                    </div>
                    <div className="form-field">
                      <label>Email</label>
                      <input type="email" value={newAdminForm.email} onChange={e => setNewAdminForm({ ...newAdminForm, email: e.target.value })} placeholder="jean.dupont@example.com" required />
                    </div>
                    <div className="form-field">
                      <label>Mot de passe temporaire</label>
                      <input type="password" value={newAdminForm.password} onChange={e => setNewAdminForm({ ...newAdminForm, password: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-primary">+ Créer le compte admin</button>
                  </form>
                </div>
              </div>

              {adminMessage && <div className="settings-status" style={{ marginTop: 16 }}>{adminMessage}</div>}
              {adminError && <div className="auth-error" style={{ marginTop: 16 }}>{adminError}</div>}

              <h3 className="admin-section-title-plain">Membres de l'équipe administrateur</h3>
              <div className="admin-table">
                {superAdmin && (
                  <div className="admin-row">
                    <div className="admin-row-info">
                      <strong>{superAdmin.name}</strong>
                      <p>{superAdmin.email}</p>
                    </div>
                    <span className="admin-badge admin-badge-super">Super Admin</span>
                  </div>
                )}
                {admins.map(a => (
                  <div key={a._id} className="admin-row">
                    <div className="admin-row-info">
                      <strong>{a.name}</strong>
                      <p>{a.email}</p>
                      <p className="admin-row-meta">Créé le {new Date(a.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span className="admin-badge">Admin</span>
                    <div className="admin-row-actions">
                      <button className="btn btn-secondary" onClick={() => handleToggleAdmin(a._id)}>Retirer</button>
                      <button className="btn btn-secondary" style={{ color: '#B3261E' }} onClick={() => handleDeleteUser(a._id)}>Supprimer</button>
                    </div>
                  </div>
                ))}
                {admins.length === 0 && <p className="admin-empty">Aucun admin pour l'instant.</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {detailsUser && (
        <div className="settings-overlay" onClick={() => setDetailsUser(null)}>
          <div className="settings-modal" onClick={e => e.stopPropagation()}>
            <div className="settings-header">
              <h2>{detailsUser.name}</h2>
              <button className="settings-close" onClick={() => setDetailsUser(null)}>✕</button>
            </div>
            <div className="settings-body">
              <p className="settings-desc">
                {detailsUser.email}<br />
                Inscrit le {new Date(detailsUser.createdAt).toLocaleDateString('fr-FR')}
              </p>
              <h3 style={{ fontSize: 14, marginBottom: 12 }}>Produits soumis ({detailsUserProducts.length})</h3>
              {detailsUserProducts.length === 0 && <p className="admin-empty">Aucun produit soumis.</p>}
              {detailsUserProducts.map(p => (
                <div key={p._id} className="admin-row admin-row-compact">
                  <div className="admin-row-info">
                    <strong>{p.name}</strong>
                    <p className="admin-row-meta">{p.votesCount} votes</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}