import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword, changeEmail, deleteAccount, updateProfile, logout, saveAuth, getUser, getToken } from '../services/auth.service'
import { uploadImage, getImageUrl } from '../services/upload.service'
import PasswordRequirements from './PasswordRequirements'
import './SettingsModal.css'

export default function SettingsModal({ onClose }) {
  const currentUser = getUser()
  const [tab, setTab] = useState('profile')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const navigate = useNavigate()

  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    avatarUrl: currentUser?.avatarUrl || '',
    githubUrl: currentUser?.githubUrl || '',
    twitterUrl: currentUser?.twitterUrl || '',
    portfolioUrl: currentUser?.portfolioUrl || ''
  })
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [emailForm, setEmailForm] = useState({ newEmail: '', confirmPassword: '' })
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')

  function resetMessages() {
    setStatus('')
    setError('')
  }

  function handleAvatarFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploadingAvatar(true)
    resetMessages()
    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const uploadRes = await uploadImage(evt.target.result)
        const fullAvatarUrl = getImageUrl(uploadRes.url)
        const updatedForm = { ...profileForm, avatarUrl: fullAvatarUrl }
        setProfileForm(updatedForm)
        
        // Auto-sauvegarde immédiate du profil en base de données et dans localStorage
        const res = await updateProfile(updatedForm)
        const token = getToken()
        saveAuth(token, res.user)
        setStatus('Photo de profil mise à jour et enregistrée avec succès.')
      } catch (err) {
        setError('Erreur lors du téléversement de la photo: ' + (err.message || 'Erreur serveur'))
      } finally {
        setUploadingAvatar(false)
      }
    }
    reader.readAsDataURL(file)
  }

  async function handleProfileSubmit(e) {
    e.preventDefault()
    resetMessages()
    setLoading(true)
    try {
      const res = await updateProfile(profileForm)
      const token = getToken()
      saveAuth(token, res.user)
      setStatus('Profil mis à jour avec succès.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    resetMessages()

    if (passwordForm.new !== passwordForm.confirm) {
      setError('Les nouveaux mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      const { token } = await changePassword(passwordForm.current, passwordForm.new)
      if (token) saveAuth(token, getUser())
      setStatus('Mot de passe mis à jour avec succès.')
      setPasswordForm({ current: '', new: '', confirm: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleEmailSubmit(e) {
    e.preventDefault()
    resetMessages()
    setLoading(true)
    try {
      const res = await changeEmail(emailForm.newEmail, emailForm.confirmPassword)
      const token = getToken()
      saveAuth(token, res.user)
      setStatus('Adresse email mise à jour avec succès.')
      setEmailForm({ newEmail: '', confirmPassword: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    resetMessages()
    setLoading(true)
    try {
      await deleteAccount(deletePassword)
      logout()
      onClose()
      navigate('/')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <h2 id="settings-title" style={{ margin: 0 }}>Paramètres du compte</h2>
          </div>
          <button className="settings-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <div className="settings-tabs">
          <button className={tab === 'profile' ? 'active' : ''} onClick={() => { setTab('profile'); resetMessages() }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profil</span>
          </button>

          <button className={tab === 'password' ? 'active' : ''} onClick={() => { setTab('password'); resetMessages() }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Sécurité</span>
          </button>

          <button className={tab === 'email' ? 'active' : ''} onClick={() => { setTab('email'); resetMessages() }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>Email</span>
          </button>

          <button className={tab === 'recover' ? 'active' : ''} onClick={() => { setTab('recover'); resetMessages() }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
            <span>Récupération</span>
          </button>

          <button className={`tab-delete ${tab === 'delete' ? 'active' : ''}`} onClick={() => { setTab('delete'); resetMessages() }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span>Supprimer</span>
          </button>
        </div>

        {error && <div className="auth-error" style={{ margin: '16px 26px 0' }}>{error}</div>}
        {status && <div className="settings-status">{status}</div>}

        <div className="settings-body">
          {tab === 'profile' && (
            <form onSubmit={handleProfileSubmit}>
              <div className="form-field">
                <label htmlFor="settings-name">Nom complet ou pseudonyme</label>
                <input
                  id="settings-name"
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="settings-bio">Bio / Courte présentation</label>
                <textarea
                  id="settings-bio"
                  rows="3"
                  value={profileForm.bio}
                  onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Décrivez votre parcours, vos compétences ou vos projets..."
                />
              </div>

              {/* Photo de Profil / Avatar Upload */}
              <div className="form-field">
                <label htmlFor="settings-avatar">Photo de profil / Avatar</label>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #38BDF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(255,255,255,0.2)' }}>
                    {profileForm.avatarUrl ? (
                      <img src={getImageUrl(profileForm.avatarUrl)} alt="Avatar preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>{profileForm.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="btn btn-secondary" style={{ padding: '9px 16px', fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>{uploadingAvatar ? 'Téléversement en cours...' : 'Téléverser une photo de profil'}</span>
                      <input type="file" accept="image/*" onChange={handleAvatarFileUpload} style={{ display: 'none' }} />
                    </label>
                    <p style={{ margin: '6px 0 0', fontSize: 11.5, color: 'var(--text-muted)' }}>
                      Format JPG, PNG ou WEBP. Auto-sauvegardé.
                    </p>
                  </div>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="settings-github">Lien GitHub</label>
                <input
                  id="settings-github"
                  type="url"
                  value={profileForm.githubUrl}
                  onChange={e => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                  placeholder="https://github.com/votre_pseudo"
                />
              </div>

              <div className="form-field">
                <label htmlFor="settings-twitter">Lien X / Twitter</label>
                <input
                  id="settings-twitter"
                  type="url"
                  value={profileForm.twitterUrl}
                  onChange={e => setProfileForm({ ...profileForm, twitterUrl: e.target.value })}
                  placeholder="https://x.com/votre_pseudo"
                />
              </div>

              <div className="form-field">
                <label htmlFor="settings-portfolio">Site Web / Portfolio</label>
                <input
                  id="settings-portfolio"
                  type="url"
                  value={profileForm.portfolioUrl}
                  onChange={e => setProfileForm({ ...profileForm, portfolioUrl: e.target.value })}
                  placeholder="https://votre-site.com"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-glow" disabled={loading || uploadingAvatar} style={{ width: '100%', marginTop: 8 }}>
                {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
              </button>
            </form>
          )}

          {tab === 'password' && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-field">
                <label htmlFor="settings-current-pwd">Mot de passe actuel</label>
                <input
                  id="settings-current-pwd"
                  type="password"
                  value={passwordForm.current}
                  onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="settings-new-pwd">Nouveau mot de passe</label>
                <input
                  id="settings-new-pwd"
                  type="password"
                  value={passwordForm.new}
                  onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  required
                />
                <PasswordRequirements password={passwordForm.new} />
              </div>
              <div className="form-field">
                <label htmlFor="settings-confirm-pwd">Confirmer le nouveau mot de passe</label>
                <input
                  id="settings-confirm-pwd"
                  type="password"
                  value={passwordForm.confirm}
                  onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-glow" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
                {loading ? 'Mise à jour...' : 'Changer le mot de passe'}
              </button>
            </form>
          )}

          {tab === 'recover' && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <p className="settings-desc">
                Si vous perdez l'accès à votre compte, utilisez la procédure sécurisée de récupération pour recevoir un code de réinitialisation par email.
              </p>
              <button className="btn btn-secondary" onClick={() => { onClose(); navigate('/forgot-password') }} style={{ marginTop: 8 }}>
                Aller à la réinitialisation de mot de passe
              </button>
            </div>
          )}

          {tab === 'email' && (
            <form onSubmit={handleEmailSubmit}>
              <div className="form-field">
                <label htmlFor="settings-new-email">Nouvelle adresse email</label>
                <input
                  id="settings-new-email"
                  type="email"
                  value={emailForm.newEmail}
                  onChange={e => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="settings-email-pwd">Confirmer avec votre mot de passe</label>
                <input
                  id="settings-email-pwd"
                  type="password"
                  value={emailForm.confirmPassword}
                  onChange={e => setEmailForm({ ...emailForm, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-glow" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
                {loading ? 'Mise à jour...' : "Mettre à jour l'email"}
              </button>
            </form>
          )}

          {tab === 'delete' && (
            <div>
              <p className="settings-desc settings-danger">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#EF4444', marginRight: 6, verticalAlign: 'middle' }}>
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <strong>Attention :</strong> Cette action est irréversible. Tous vos produits soumis, upvotes et données créateur seront définitivement supprimés.
              </p>
              <div className="form-field">
                <label htmlFor="settings-del-pwd">Votre mot de passe</label>
                <input
                  id="settings-del-pwd"
                  type="password"
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="settings-del-confirm">Tapez <strong>SUPPRIMER</strong> pour confirmer</label>
                <input
                  id="settings-del-confirm"
                  value={deleteConfirm}
                  onChange={e => setDeleteConfirm(e.target.value)}
                  placeholder="SUPPRIMER"
                />
              </div>
              <button
                className="btn btn-secondary"
                style={{ color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)', width: '100%', marginTop: 8 }}
                disabled={deleteConfirm !== 'SUPPRIMER' || !deletePassword || loading}
                onClick={handleDelete}
              >
                {loading ? 'Suppression...' : 'Supprimer définitivement mon compte'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}