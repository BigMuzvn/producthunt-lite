import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changeName, changePassword, changeEmail, deleteAccount, logout, saveAuth, getUser, getToken } from '../services/auth.service'
import PasswordRequirements from './PasswordRequirements'

export default function SettingsModal({ onClose }) {
  const currentUser = getUser()
  const [tab, setTab] = useState('profile')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [nameForm, setNameForm] = useState(currentUser?.name || '')
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [emailForm, setEmailForm] = useState({ newEmail: '', confirmPassword: '' })
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')

  function resetMessages() {
    setStatus('')
    setError('')
  }

  async function handleNameSubmit(e) {
    e.preventDefault()
    resetMessages()
    setLoading(true)
    try {
      const res = await changeName(nameForm)
      const token = getToken()
      saveAuth(token, res.user)
      setStatus('Nom mis à jour avec succès.')
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
      await changePassword(passwordForm.current, passwordForm.new)
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
          <h2 id="settings-title">Paramètres du compte</h2>
          <button className="settings-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <div className="settings-tabs">
          <button className={tab === 'profile' ? 'active' : ''} onClick={() => { setTab('profile'); resetMessages() }}>Profil</button>
          <button className={tab === 'password' ? 'active' : ''} onClick={() => { setTab('password'); resetMessages() }}>Mot de passe</button>
          <button className={tab === 'recover' ? 'active' : ''} onClick={() => { setTab('recover'); resetMessages() }}>Récupération</button>
          <button className={tab === 'email' ? 'active' : ''} onClick={() => { setTab('email'); resetMessages() }}>Email</button>
          <button className={tab === 'delete' ? 'active' : ''} onClick={() => { setTab('delete'); resetMessages() }}>Supprimer</button>
        </div>

        {error && <div className="auth-error" style={{ margin: '16px 24px 0' }}>{error}</div>}
        {status && <div className="settings-status">{status}</div>}

        <div className="settings-body">
          {tab === 'profile' && (
            <form onSubmit={handleNameSubmit}>
              <div className="form-field">
                <label htmlFor="settings-name">Nom complet</label>
                <input
                  id="settings-name"
                  type="text"
                  value={nameForm}
                  onChange={e => setNameForm(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Mise à jour...' : 'Mettre à jour le nom'}
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
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </button>
            </form>
          )}

          {tab === 'recover' && (
            <div>
              <p className="settings-desc">
                Si tu perds l'accès à ton compte, utilise "Mot de passe oublié" depuis la page de connexion pour recevoir un code de récupération par email.
              </p>
              <button className="btn btn-secondary" onClick={() => { onClose(); navigate('/forgot-password') }}>
                Aller à la récupération de compte
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
                <label htmlFor="settings-email-pwd">Confirme avec ton mot de passe</label>
                <input
                  id="settings-email-pwd"
                  type="password"
                  value={emailForm.confirmPassword}
                  onChange={e => setEmailForm({ ...emailForm, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Mise à jour...' : "Mettre à jour l'email"}
              </button>
            </form>
          )}

          {tab === 'delete' && (
            <div>
              <p className="settings-desc settings-danger">
                Cette action est irréversible. Tous tes produits et votes seront définitivement supprimés.
              </p>
              <div className="form-field">
                <label htmlFor="settings-del-pwd">Ton mot de passe</label>
                <input
                  id="settings-del-pwd"
                  type="password"
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="settings-del-confirm">Tape "SUPPRIMER" pour confirmer</label>
                <input
                  id="settings-del-confirm"
                  value={deleteConfirm}
                  onChange={e => setDeleteConfirm(e.target.value)}
                />
              </div>
              <button
                className="btn btn-secondary"
                style={{ color: '#B3261E', borderColor: '#B3261E' }}
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