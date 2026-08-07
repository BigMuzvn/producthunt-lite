import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword, resetPassword } from '../services/auth.service'
import './AuthPages.css'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleRequestCode(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      setStep('reset')
      setInfo('Si ce compte existe, un code a été envoyé à cette adresse.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      await resetPassword(email, otpCode, newPassword)
      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <Link to="/" className="auth-logo">ProductHunt Lite</Link>

          <h1 className="auth-heading">Mot de passe oublié</h1>
          <p className="auth-subtext">
            <Link to="/login">Retour à la connexion</Link>
          </p>

          {error && <div className="auth-error">{error}</div>}
          {info && step === 'reset' && <div className="settings-status">{info}</div>}

          {step === 'email' && (
            <form onSubmit={handleRequestCode}>
              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="me@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                {loading ? 'Envoi...' : 'Recevoir un code'}
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword}>
              <div className="auth-field">
                <label htmlFor="otpCode">Code reçu par email</label>
                <input
                  id="otpCode"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  style={{ letterSpacing: 6, fontSize: 20, textAlign: 'center' }}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="auth-visual-panel">
        <div className="auth-visual-content">
          <p className="auth-visual-eyebrow">Ça arrive à tout le monde</p>
          <h2 className="auth-visual-heading">On te remet sur pied en deux minutes.</h2>
        </div>
      </div>
    </div>
  )
}