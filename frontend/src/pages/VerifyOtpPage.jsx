import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { verifyOtp, resendOtp } from '../services/auth.service'
import { saveAuth } from '../services/auth.service'
import './AuthPages.css'

export default function VerifyOtpPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await verifyOtp(email, code)
      saveAuth(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError('')
    setInfo('')
    try {
      await resendOtp(email)
      setInfo('Un nouveau code a été envoyé.')
    } catch (err) {
      setError(err.message)
    }
  }

  if (!email) {
    return (
      <div className="auth-page">
        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <p>Aucun email à vérifier. <Link to="/signup">Retour à l'inscription</Link></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <Link to="/" className="auth-logo">ProductHunt Lite</Link>
          <h1 className="auth-heading">Vérifie ton email</h1>
          <p className="auth-subtext">
            Un code à 6 chiffres a été envoyé à <strong>{email}</strong>
          </p>

          {error && <div className="auth-error">{error}</div>}
          {info && <div className="settings-status">{info}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="code">Code de vérification</label>
              <input
                id="code"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                style={{ letterSpacing: 6, fontSize: 20, textAlign: 'center' }}
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Vérification...' : 'Confirmer'}
            </button>
          </form>

          <p className="auth-subtext" style={{ marginTop: 16 }}>
            Rien reçu ? <button onClick={handleResend} className="btn-link-style" style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>Renvoyer le code</button>
          </p>
        </div>
      </div>

      <div className="auth-visual-panel">
        <div className="auth-visual-content">
          <p className="auth-visual-eyebrow">Presque prêt</p>
          <h2 className="auth-visual-heading">Plus qu'une étape avant de rejoindre la communauté.</h2>
        </div>
      </div>
    </div>
  )
}