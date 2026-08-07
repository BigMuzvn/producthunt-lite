import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword, changeEmail, deleteAccount, logout } from '../services/auth.service'

export default function SettingsModal({ onClose }) {
  const [tab, setTab] = useState('password')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [emailForm, setEmailForm] = useState({ newEmail: '', confirmPassword: '' })
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')

  function resetMessages() {
    setStatus('')
    setError('')
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
      await changeEmail(emailForm.newEmail, emailForm.confirmPassword)
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
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Paramètres du compte</h2>
          <button className="settings-close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-tabs">
          <button className={tab === 'password' ? 'active' : ''} onClick={() => { setTab('password'); resetMessages() }}>Mot de passe</button>
          <button className={tab === 'recover' ? 'active' : ''} onClick={() => { setTab('recover'); resetMessages() }}>Récupération</button>
          <button className={tab === 'email' ? 'active' : ''} onClick={() => { setTab('email'); resetMessages() }}>Email</button>
          <button className={tab === 'delete' ? 'active' : ''} onClick={() => { setTab('delete'); resetMessages() }}>Supprimer</button>
        </div>

        {error && <div className="auth-error" style={{ margin: '16px 24px 0' }}>{error}</div>}
        {status && <div className="settings-status">{status}</div>}

        <div className="settings-body">
          {tab === 'password' && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-field">
                <label>Mot de passe actuel</label>
                <input type="password" value={passwordForm.current} onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Nouveau mot de passe</label>
                <input type="password" value={passwordForm.new} onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Confirmer le nouveau mot de passe</label>
                <input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })} required />
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
                <label>Nouvelle adresse email</label>
                <input type="email" value={emailForm.newEmail} onChange={e => setEmailForm({ ...emailForm, newEmail: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Confirme avec ton mot de passe</label>
                <input type="password" value={emailForm.confirmPassword} onChange={e => setEmailForm({ ...emailForm, confirmPassword: e.target.value })} required />
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
                <label>Ton mot de passe</label>
                <input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Tape "SUPPRIMER" pour confirmer</label>
                <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} />
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