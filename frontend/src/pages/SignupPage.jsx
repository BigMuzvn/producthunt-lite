import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, saveAuth } from '../services/auth.service'
import './AuthPages.css'
import PasswordRequirements from '../components/PasswordRequirements'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Inscription — ProductHunt Lite'
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/verify-otp', { state: { email } })
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
          <Link to="/" className="auth-logo">
            <div className="auth-logo-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
              </svg>
            </div>
            <span className="auth-logo-text">
              ProductHunt <span>LITE</span>
            </span>
          </Link>

          <h1 className="auth-heading">Créer un compte</h1>
          <p className="auth-subtext">
            Déjà inscrit ? <Link to="/login">Se connecter</Link>
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="name">Nom complet ou pseudonyme</label>
              <div className="auth-input-wrapper">
                <input
                  id="name"
                  type="text"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="email">Adresse email</label>
              <div className="auth-input-wrapper">
                <input
                  id="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Mot de passe</label>
              <div className="auth-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <PasswordRequirements password={password} />
            </div>

            <button type="submit" className="btn btn-primary auth-submit btn-glow" disabled={loading}>
              {loading ? 'Création en cours...' : 'Créer mon compte ↗'}
            </button>
          </form>

          <p className="auth-terms">
            En créant un compte, vous acceptez nos conditions d'utilisation et notre charte de confidentialité.
          </p>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>

      <div className="auth-visual-panel">
        <div className="auth-visual-ambient-glow" />
        <div className="auth-visual-content">
          <div className="auth-visual-eyebrow">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Rejoins la communauté</span>
          </div>
          <h2 className="auth-visual-heading">
            Découvre et propulse les meilleurs produits tech.
          </h2>

          <div className="auth-preview-stack">
            <div className="auth-preview-card">
              <div className="auth-preview-logo" style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)' }}>N</div>
              <div className="auth-preview-info">
                <h4>Notion Lite</h4>
                <p>Ton second cerveau, propulsé par l'IA</p>
              </div>
              <span className="auth-preview-votes">▲ 216</span>
            </div>

            <div className="auth-preview-card">
              <div className="auth-preview-logo" style={{ background: 'linear-gradient(135deg, #38BDF8, #0284C7)' }}>F</div>
              <div className="auth-preview-info">
                <h4>Flowbase</h4>
                <p>Automatise tes workflows sans code</p>
              </div>
              <span className="auth-preview-votes">▲ 187</span>
            </div>

            <div className="auth-preview-card">
              <div className="auth-preview-logo" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>V</div>
              <div className="auth-preview-info">
                <h4>Voxa AI</h4>
                <p>Transcription et résumés en direct</p>
              </div>
              <span className="auth-preview-votes">▲ 175</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}