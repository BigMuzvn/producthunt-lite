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
import AdminOverviewTab from '../components/admin/AdminOverviewTab'
import AdminUsersTab from '../components/admin/AdminUsersTab'
import AdminProductsTab from '../components/admin/AdminProductsTab'
import AdminCategoriesTab from '../components/admin/AdminCategoriesTab'
import AdminTeamTab from '../components/admin/AdminTeamTab'
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
    document.title = 'Administration — ProductHunt Lite'
    async function loadAll() {
      setLoading(true)
      try {
        const [s, u, p, c] = await Promise.all([
          getStats(),
          getAllUsers(),
          getProducts(),
          getCategories()
        ])
        setStats(s || null)
        setUsers(Array.isArray(u) ? u : [])
        setProducts(Array.isArray(p) ? p : [])
        setCategories(Array.isArray(c) ? c : [])
      } catch (err) {
        console.error('Erreur chargement admin:', err)
        setAdminError(err.message || 'Erreur lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  function resetAdminFeedback() {
    setAdminMessage('')
    setAdminError('')
  }

  async function handleDeleteUser(id) {
    if (!window.confirm('Supprimer cet utilisateur et tous ses produits ?')) return
    resetAdminFeedback()
    try {
      await deleteUser(id)
      setUsers(users.filter(u => u._id !== id))
      setProducts(products.filter(p => (p.makerId?._id || p.makerId) !== id))
      setAdminMessage('Utilisateur supprimé.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleToggleAdmin(id) {
    resetAdminFeedback()
    try {
      const updated = await toggleAdmin(id)
      setUsers(users.map(u => u._id === id ? { ...u, isAdmin: updated.user.isAdmin } : u))
      setAdminMessage(updated.message)
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleCreateAdminSubmit(e) {
    e.preventDefault()
    resetAdminFeedback()
    try {
      const created = await createAdmin(newAdminForm.name, newAdminForm.email, newAdminForm.password)
      setUsers([created, ...users])
      setNewAdminForm({ name: '', email: '', password: '' })
      setAdminMessage(`Compte administrateur créé pour ${created.email}`)
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm('Supprimer ce produit ?')) return
    resetAdminFeedback()
    try {
      await adminDeleteProduct(id)
      setProducts(products.filter(p => p._id !== id))
      setAdminMessage('Produit supprimé.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleDeleteCategory(id) {
    if (!window.confirm('Supprimer cette catégorie ? Les produits associés ne seront pas supprimés.')) return
    resetAdminFeedback()
    try {
      await adminDeleteCategory(id)
      setCategories(categories.filter(c => c._id !== id))
      setAdminMessage('Catégorie supprimée.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleCreateCategorySubmit(e) {
    e.preventDefault()
    resetAdminFeedback()
    try {
      const cat = await createCategory(newCategoryForm.name, newCategoryForm.color)
      setCategories([...categories, cat])
      setNewCategoryForm({ name: '', color: '#7C6CF4' })
      setAdminMessage('Catégorie créée.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleNameSubmit(e) {
    e.preventDefault()
    resetAdminFeedback()
    try {
      const updated = await updateOwnName(nameForm.name)
      const token = getToken()
      saveAuth(token, updated.user)
      setUsers(users.map(u => u._id === currentUser?._id ? { ...u, name: updated.user.name } : u))
      setAdminMessage('Nom mis à jour.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleRequestEmailOtp(e) {
    e.preventDefault()
    resetAdminFeedback()
    try {
      await requestEmailChangeOtp(emailForm.newEmail, emailForm.currentPassword)
      setEmailForm({ ...emailForm, step: 'otp' })
      setAdminMessage(`Code de confirmation envoyé à ${emailForm.newEmail}`)
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleConfirmEmailChange(e) {
    e.preventDefault()
    resetAdminFeedback()
    try {
      const updated = await confirmEmailChange(emailForm.otpCode)
      const token = getToken()
      saveAuth(token, updated.user)
      setUsers(users.map(u => u._id === currentUser?._id ? { ...u, email: updated.user.email } : u))
      setEmailForm({ newEmail: '', currentPassword: '', otpCode: '', step: 'idle' })
      setAdminMessage('Adresse email mise à jour.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleRequestPasswordOtp(e) {
    e.preventDefault()
    resetAdminFeedback()
    try {
      await requestPasswordChangeOtp(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordForm({ ...passwordForm, step: 'otp' })
      setAdminMessage('Code de confirmation envoyé à ton adresse email.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  async function handleConfirmPasswordChange(e) {
    e.preventDefault()
    resetAdminFeedback()
    try {
      await confirmPasswordChange(passwordForm.otpCode)
      setPasswordForm({ currentPassword: '', newPassword: '', otpCode: '', step: 'idle' })
      setAdminMessage('Mot de passe mis à jour.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  function startEditingAdmin(admin) {
    resetAdminFeedback()
    setEditingAdminId(admin._id)
    setEditAdminForm({ name: admin.name, email: admin.email })
  }

  async function handleEditAdminSubmit(e, id) {
    e.preventDefault()
    resetAdminFeedback()
    try {
      const updated = await updateOtherAdmin(id, editAdminForm.name, editAdminForm.email)
      setUsers(users.map(u => u._id === id ? { ...u, name: updated.user.name, email: updated.user.email } : u))
      setEditingAdminId(null)
      setAdminMessage('Informations administrateur mises à jour.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  function startResettingAdminPassword(id) {
    resetAdminFeedback()
    setResettingAdminId(id)
    setResetAdminPassword('')
  }

  async function handleResetAdminPasswordSubmit(e, id) {
    e.preventDefault()
    resetAdminFeedback()
    try {
      await resetOtherAdminPassword(id, resetAdminPassword)
      setResettingAdminId(null)
      setResetAdminPassword('')
      setAdminMessage('Nouveau mot de passe enregistré pour cet administrateur.')
    } catch (err) {
      setAdminError(err.message)
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  const detailsUserProducts = detailsUser
    ? products.filter(p => (p.makerId?._id || p.makerId) === detailsUser._id)
    : []

  return (
    <>
      <Header />
      <div className="admin-page">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <h1 className="admin-title" style={{ margin: 0 }}>Panneau d'administration</h1>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: '#B3261E',
                borderColor: 'rgba(179, 38, 30, 0.3)',
                cursor: 'pointer'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Se déconnecter
            </button>
          </div>

          <div className="admin-tabs">
            <button className={tab === 'overview' ? 'active' : ''} onClick={() => { setTab('overview'); resetAdminFeedback() }}>Vue d'ensemble</button>
            <button className={tab === 'users' ? 'active' : ''} onClick={() => { setTab('users'); resetAdminFeedback() }}>Clients ({(users || []).filter(u => !u.isAdmin && !u.isSuperAdmin).length})</button>
            <button className={tab === 'products' ? 'active' : ''} onClick={() => { setTab('products'); resetAdminFeedback() }}>Produits ({(products || []).length})</button>
            <button className={tab === 'categories' ? 'active' : ''} onClick={() => { setTab('categories'); resetAdminFeedback() }}>Catégories ({(categories || []).length})</button>
            {currentUser?.isSuperAdmin && (
              <button className={tab === 'admins' ? 'active' : ''} onClick={() => { setTab('admins'); resetAdminFeedback() }}>Gestion Admin</button>
            )}
          </div>

          {loading && <p className="admin-empty">Chargement des données...</p>}

          {!loading && tab === 'overview' && <AdminOverviewTab stats={stats} />}

          {!loading && tab === 'users' && (
            <AdminUsersTab
              users={users}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              setDetailsUser={setDetailsUser}
              handleDeleteUser={handleDeleteUser}
            />
          )}

          {!loading && tab === 'products' && (
            <AdminProductsTab
              products={products}
              handleDeleteProduct={handleDeleteProduct}
            />
          )}

          {!loading && tab === 'categories' && (
            <AdminCategoriesTab
              categories={categories}
              newCategoryForm={newCategoryForm}
              setNewCategoryForm={setNewCategoryForm}
              handleCreateCategorySubmit={handleCreateCategorySubmit}
              handleDeleteCategory={handleDeleteCategory}
              adminMessage={adminMessage}
              adminError={adminError}
            />
          )}

          {!loading && tab === 'admins' && currentUser?.isSuperAdmin && (
            <AdminTeamTab
              currentUser={currentUser}
              users={users}
              nameForm={nameForm}
              setNameForm={setNameForm}
              handleNameSubmit={handleNameSubmit}
              emailForm={emailForm}
              setEmailForm={setEmailForm}
              handleRequestEmailOtp={handleRequestEmailOtp}
              handleConfirmEmailChange={handleConfirmEmailChange}
              passwordForm={passwordForm}
              setPasswordForm={setPasswordForm}
              handleRequestPasswordOtp={handleRequestPasswordOtp}
              handleConfirmPasswordChange={handleConfirmPasswordChange}
              newAdminForm={newAdminForm}
              setNewAdminForm={setNewAdminForm}
              handleCreateAdminSubmit={handleCreateAdminSubmit}
              editingAdminId={editingAdminId}
              setEditingAdminId={setEditingAdminId}
              editAdminForm={editAdminForm}
              setEditAdminForm={setEditAdminForm}
              handleEditAdminSubmit={handleEditAdminSubmit}
              startEditingAdmin={startEditingAdmin}
              resettingAdminId={resettingAdminId}
              setResettingAdminId={setResettingAdminId}
              resetAdminPassword={resetAdminPassword}
              setResetAdminPassword={setResetAdminPassword}
              handleResetAdminPasswordSubmit={handleResetAdminPasswordSubmit}
              startResettingAdminPassword={startResettingAdminPassword}
              handleToggleAdmin={handleToggleAdmin}
              handleDeleteUser={handleDeleteUser}
              adminMessage={adminMessage}
              adminError={adminError}
            />
          )}
        </div>
      </div>

      {detailsUser && (
        <div className="settings-overlay" onClick={() => setDetailsUser(null)}>
          <div className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="details-user-title" onClick={e => e.stopPropagation()}>
            <div className="settings-header">
              <h2 id="details-user-title">{detailsUser.name}</h2>
              <button className="settings-close" onClick={() => setDetailsUser(null)} aria-label="Fermer">✕</button>
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