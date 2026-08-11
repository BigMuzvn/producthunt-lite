import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import {
  getStats, getAllUsers, deleteUser, toggleAdmin, createAdmin,
  adminDeleteProduct, adminDeleteCategory,
  updateOwnName, requestEmailChangeOtp, confirmEmailChange,
  requestPasswordChangeOtp, confirmPasswordChange,
  updateOtherAdmin, resetOtherAdminPassword
} from '../services/admin.service'
import { getProducts } from '../services/product.service'
import { getCategories, createCategory } from '../services/category.service'
import { getUser, getToken, saveAuth, logout } from '../services/auth.service'
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
  const [nameForm, setNameForm] = useState({ name: currentUser?.name || '' })
  const [emailForm, setEmailForm] = useState({ newEmail: '', currentPassword: '', otpCode: '', step: 'idle' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', otpCode: '', step: 'idle' })
  const [adminMessage, setAdminMessage] = useState('')
  const [adminError, setAdminError] = useState('')
  const [editingAdminId, setEditingAdminId] = useState(null)
  const [editAdminForm, setEditAdminForm] = useState({ name: '', email: '' })
  const [resettingAdminId, setResettingAdminId] = useState(null)
  const [resetAdminPassword, setResetAdminPassword] = useState('')
  const [newCategoryForm, setNewCategoryForm] = useState({ name: '', color: '#7C6CF4' })

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

  async function handleCreateCategorySubmit(e) {
    e.preventDefault()
    setAdminMessage('')
    setAdminError('')
    try {
      const category = await createCategory(newCategoryForm.name, newCategoryForm.color)
      setCategories([...categories, category])
      setNewCategoryForm({ name: '', color: '#7C6CF4' })
      setAdminMessage('Catégorie créée avec succès.')
    } catch (err) {
      setAdminError(err.message)
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

  async function handleNameSubmit(e) {
    e.preventDefault()
    setAdminMessage('')
    setAdminError('')
    try {
      const res = await updateOwnName(nameForm.name)
      saveAuth(getToken(), res.user)
      setAdminMessage('Nom mis à jour avec succès.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleRequestEmailOtp(e) {
    e.preventDefault()
    setAdminMessage('')
    setAdminError('')
    try {
      await requestEmailChangeOtp(emailForm.newEmail, emailForm.currentPassword)
      setEmailForm({ ...emailForm, step: 'otp-sent' })
      setAdminMessage('Code envoyé à la nouvelle adresse. Vérifie la boîte mail.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleConfirmEmailChange(e) {
    e.preventDefault()
    setAdminMessage('')
    setAdminError('')
    try {
      const res = await confirmEmailChange(emailForm.otpCode)
      saveAuth(getToken(), res.user)
      setEmailForm({ newEmail: '', currentPassword: '', otpCode: '', step: 'idle' })
      setAdminMessage('Email mis à jour avec succès.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleRequestPasswordOtp(e) {
    e.preventDefault()
    setAdminMessage('')
    setAdminError('')
    try {
      await requestPasswordChangeOtp(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordForm({ ...passwordForm, step: 'otp-sent' })
      setAdminMessage('Code envoyé à ton adresse actuelle.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleConfirmPasswordChange(e) {
    e.preventDefault()
    setAdminMessage('')
    setAdminError('')
    try {
      await confirmPasswordChange(passwordForm.otpCode)
      setPasswordForm({ currentPassword: '', newPassword: '', otpCode: '', step: 'idle' })
      setAdminMessage('Mot de passe mis à jour avec succès.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  function startEditingAdmin(admin) {
    setEditingAdminId(admin._id)
    setEditAdminForm({ name: admin.name, email: admin.email })
    setAdminMessage('')
    setAdminError('')
  }

  async function handleEditAdminSubmit(e, id) {
    e.preventDefault()
    setAdminMessage('')
    setAdminError('')
    try {
      const res = await updateOtherAdmin(id, editAdminForm)
      setUsers(users.map(u => u._id === id ? { ...u, name: res.user.name, email: res.user.email } : u))
      setEditingAdminId(null)
      setAdminMessage('Admin mis à jour avec succès.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  function startResettingAdminPassword(id) {
    setResettingAdminId(id)
    setResetAdminPassword('')
    setAdminMessage('')
    setAdminError('')
  }

  async function handleResetAdminPasswordSubmit(e, id) {
    e.preventDefault()
    setAdminMessage('')
    setAdminError('')
    try {
      await resetOtherAdminPassword(id, resetAdminPassword)
      setResettingAdminId(null)
      setResetAdminPassword('')
      setAdminMessage('Mot de passe de l\'admin réinitialisé avec succès.')
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

  const evolutionMax = stats ? Math.max(1, ...stats.evolution.flatMap(d => [d.newUsers, d.newVotes])) : 1
  const categoryMax = stats ? Math.max(1, ...stats.categoryBreakdown.map(c => c.count)) : 1

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
            <div>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <span className="admin-stat-value">{stats.totals.totalClients}</span>
                  <span className="admin-stat-label">Clients</span>
                </div>
                <div className="admin-stat-card">
                  <span className="admin-stat-value">{stats.totals.totalAdmins}</span>
                  <span className="admin-stat-label">Admins</span>
                </div>
                <div className="admin-stat-card">
                  <span className="admin-stat-value">{stats.totals.totalProducts}</span>
                  <span className="admin-stat-label">Produits</span>
                </div>
                <div className="admin-stat-card">
                  <span className="admin-stat-value">{stats.totals.totalCategories}</span>
                  <span className="admin-stat-label">Catégories</span>
                </div>
                <div className="admin-stat-card">
                  <span className="admin-stat-value">{stats.totals.totalVotes}</span>
                  <span className="admin-stat-label">Votes</span>
                </div>
              </div>

              <h3 className="admin-section-title-plain">Évolution (7 derniers jours)</h3>
              <div className="admin-panel">
                <div className="admin-evolution-chart">
                  {stats.evolution.map(day => (
                    <div key={day.date} className="admin-evolution-day">
                      <div className="admin-evolution-bars">
                        <div
                          className="admin-evolution-bar admin-evolution-bar-users"
                          style={{ height: `${(day.newUsers / evolutionMax) * 100}%` }}
                          title={`${day.newUsers} inscription(s)`}
                        ></div>
                        <div
                          className="admin-evolution-bar admin-evolution-bar-votes"
                          style={{ height: `${(day.newVotes / evolutionMax) * 100}%` }}
                          title={`${day.newVotes} vote(s)`}
                        ></div>
                      </div>
                      <span className="admin-evolution-label">
                        {new Date(day.date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="admin-evolution-legend">
                  <span className="admin-evolution-legend-item">
                    <span className="admin-evolution-legend-dot" style={{ background: 'var(--accent)' }}></span>
                    Inscriptions
                  </span>
                  <span className="admin-evolution-legend-item">
                    <span className="admin-evolution-legend-dot" style={{ background: 'var(--dark)' }}></span>
                    Votes
                  </span>
                </div>
              </div>

              <div className="admin-overview-grid">
                <div className="admin-panel">
                  <h3>Top produits</h3>
                  {stats.topProducts.length === 0 && <p className="admin-empty">Aucun produit pour l'instant.</p>}
                  {stats.topProducts.map((p, i) => (
                    <div key={p._id} className="admin-row admin-row-compact" style={{ marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-muted)', width: 16 }}>{i + 1}</span>
                      <img src={p.logoUrl || 'https://placehold.co/32'} alt={p.name} className="admin-row-logo" style={{ width: 32, height: 32 }} />
                      <div className="admin-row-info">
                        <strong>{p.name}</strong>
                      </div>
                      <span className="admin-badge">{p.votesCount} votes</span>
                    </div>
                  ))}
                </div>

                <div className="admin-panel">
                  <h3>Répartition par catégorie</h3>
                  {stats.categoryBreakdown.length === 0 && <p className="admin-empty">Aucune catégorie pour l'instant.</p>}
                  {stats.categoryBreakdown.map(c => (
                    <div key={c.name} className="admin-category-bar-row">
                      <span className="admin-category-bar-label">
                        <span className="admin-category-dot" style={{ background: c.color }}></span>
                        {c.name}
                      </span>
                      <div className="admin-category-bar-track">
                        <div
                          className="admin-category-bar-fill"
                          style={{ width: `${(c.count / categoryMax) * 100}%`, background: c.color }}
                        ></div>
                      </div>
                      <span className="admin-category-bar-count">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-overview-grid">
                <div className="admin-panel">
                  <h3>Derniers inscrits</h3>
                  {stats.recentActivity.recentUsers.length === 0 && <p className="admin-empty">Aucune inscription récente.</p>}
                  {stats.recentActivity.recentUsers.map(u => (
                    <div key={u._id} className="admin-row admin-row-compact" style={{ marginBottom: 8 }}>
                      <div className="admin-row-info">
                        <strong>{u.name}</strong>
                        <p>{u.email}</p>
                      </div>
                      <span className="admin-row-meta">{new Date(u.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  ))}
                </div>

                <div className="admin-panel">
                  <h3>Derniers produits soumis</h3>
                  {stats.recentActivity.recentProducts.length === 0 && <p className="admin-empty">Aucun produit récent.</p>}
                  {stats.recentActivity.recentProducts.map(p => (
                    <div key={p._id} className="admin-row admin-row-compact" style={{ marginBottom: 8 }}>
                      <img src={p.logoUrl || 'https://placehold.co/32'} alt={p.name} className="admin-row-logo" style={{ width: 32, height: 32 }} />
                      <div className="admin-row-info">
                        <strong>{p.name}</strong>
                        <p>par {p.makerId?.name}</p>
                      </div>
                      <span className="admin-row-meta">{new Date(p.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  ))}
                </div>
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
            <div>
              <div className="admin-panel" style={{ marginBottom: 20 }}>
                <h3>Ajouter une catégorie</h3>
                <form onSubmit={handleCreateCategorySubmit} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div className="form-field" style={{ flex: 1, minWidth: 200 }}>
                    <label>Nom</label>
                    <input value={newCategoryForm.name} onChange={e => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })} placeholder="ex: Productivité" required />
                  </div>
                  <div className="form-field">
                    <label>Couleur</label>
                    <input type="color" value={newCategoryForm.color} onChange={e => setNewCategoryForm({ ...newCategoryForm, color: e.target.value })} style={{ width: 48, height: 38, padding: 2 }} />
                  </div>
                  <button type="submit" className="btn btn-primary">+ Créer la catégorie</button>
                </form>
              </div>

              {adminMessage && <div className="settings-status" style={{ marginBottom: 16 }}>{adminMessage}</div>}
              {adminError && <div className="auth-error" style={{ marginBottom: 16 }}>{adminError}</div>}

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
            </div>
          )}

          {tab === 'admins' && currentUser?.isSuperAdmin && (
            <div>
              <div className="admin-panels-grid">
                <div className="admin-panel">
                  <h3>Mon profil</h3>

                  <h4 style={{ fontSize: 13, marginTop: 4, marginBottom: 8, color: '#9A94B8' }}>Nom</h4>
                  <form onSubmit={handleNameSubmit}>
                    <div className="form-field">
                      <input value={nameForm.name} onChange={e => setNameForm({ name: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-secondary">Enregistrer le nom</button>
                  </form>

                  <h4 style={{ fontSize: 13, marginTop: 24, marginBottom: 8, color: '#9A94B8' }}>Email actuel : {currentUser?.email}</h4>
                  {emailForm.step === 'idle' ? (
                    <form onSubmit={handleRequestEmailOtp}>
                      <div className="form-field">
                        <label>Nouvel email</label>
                        <input type="email" value={emailForm.newEmail} onChange={e => setEmailForm({ ...emailForm, newEmail: e.target.value })} required />
                      </div>
                      <div className="form-field">
                        <label>Mot de passe actuel</label>
                        <input type="password" value={emailForm.currentPassword} onChange={e => setEmailForm({ ...emailForm, currentPassword: e.target.value })} required />
                      </div>
                      <button type="submit" className="btn btn-secondary">Envoyer le code de confirmation</button>
                    </form>
                  ) : (
                    <form onSubmit={handleConfirmEmailChange}>
                      <p className="admin-row-meta">Code envoyé à {emailForm.newEmail}</p>
                      <div className="form-field">
                        <label>Code reçu</label>
                        <input value={emailForm.otpCode} onChange={e => setEmailForm({ ...emailForm, otpCode: e.target.value })} required />
                      </div>
                      <button type="submit" className="btn btn-primary">Confirmer le nouvel email</button>
                      <button type="button" className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => setEmailForm({ newEmail: '', currentPassword: '', otpCode: '', step: 'idle' })}>Annuler</button>
                    </form>
                  )}

                  <h4 style={{ fontSize: 13, marginTop: 24, marginBottom: 8, color: '#9A94B8' }}>Mot de passe</h4>
                  {passwordForm.step === 'idle' ? (
                    <form onSubmit={handleRequestPasswordOtp}>
                      <div className="form-field">
                        <label>Mot de passe actuel</label>
                        <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
                      </div>
                      <div className="form-field">
                        <label>Nouveau mot de passe</label>
                        <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
                      </div>
                      <button type="submit" className="btn btn-secondary">Envoyer le code de confirmation</button>
                    </form>
                  ) : (
                    <form onSubmit={handleConfirmPasswordChange}>
                      <p className="admin-row-meta">Code envoyé à ton adresse actuelle</p>
                      <div className="form-field">
                        <label>Code reçu</label>
                        <input value={passwordForm.otpCode} onChange={e => setPasswordForm({ ...passwordForm, otpCode: e.target.value })} required />
                      </div>
                      <button type="submit" className="btn btn-primary">Confirmer le nouveau mot de passe</button>
                      <button type="button" className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => setPasswordForm({ currentPassword: '', newPassword: '', otpCode: '', step: 'idle' })}>Annuler</button>
                    </form>
                  )}
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
                    {editingAdminId === a._id ? (
                      <form onSubmit={e => handleEditAdminSubmit(e, a._id)} className="admin-row-info" style={{ flex: 1 }}>
                        <div className="form-field">
                          <label>Nom</label>
                          <input value={editAdminForm.name} onChange={e => setEditAdminForm({ ...editAdminForm, name: e.target.value })} required />
                        </div>
                        <div className="form-field">
                          <label>Email</label>
                          <input type="email" value={editAdminForm.email} onChange={e => setEditAdminForm({ ...editAdminForm, email: e.target.value })} required />
                        </div>
                        <div className="admin-row-actions">
                          <button type="submit" className="btn btn-primary">Enregistrer</button>
                          <button type="button" className="btn btn-secondary" onClick={() => setEditingAdminId(null)}>Annuler</button>
                        </div>
                      </form>
                    ) : resettingAdminId === a._id ? (
                      <form onSubmit={e => handleResetAdminPasswordSubmit(e, a._id)} className="admin-row-info" style={{ flex: 1 }}>
                        <div className="form-field">
                          <label>Nouveau mot de passe pour {a.name}</label>
                          <input type="password" value={resetAdminPassword} onChange={e => setResetAdminPassword(e.target.value)} required />
                        </div>
                        <div className="admin-row-actions">
                          <button type="submit" className="btn btn-primary">Réinitialiser</button>
                          <button type="button" className="btn btn-secondary" onClick={() => setResettingAdminId(null)}>Annuler</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="admin-row-info">
                          <strong>{a.name}</strong>
                          <p>{a.email}</p>
                          <p className="admin-row-meta">Créé le {new Date(a.createdAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <span className="admin-badge">Admin</span>
                        <div className="admin-row-actions">
                          <button className="btn btn-secondary" onClick={() => startEditingAdmin(a)}>Modifier</button>
                          <button className="btn btn-secondary" onClick={() => startResettingAdminPassword(a._id)}>Réinit. mdp</button>
                          <button className="btn btn-secondary" onClick={() => handleToggleAdmin(a._id)}>Retirer</button>
                          <button className="btn btn-secondary" style={{ color: '#B3261E' }} onClick={() => handleDeleteUser(a._id)}>Supprimer</button>
                        </div>
                      </>
                    )}
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