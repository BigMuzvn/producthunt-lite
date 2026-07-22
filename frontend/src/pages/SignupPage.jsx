import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, saveAuth } from '../services/auth.service'
import './AuthPages.css'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await register(name, email, password)
      saveAuth(data.token, data.user)
      navigate('/dashboard')
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

          <h1 className="auth-heading">Créer un compte</h1>
          <p className="auth-subtext">
            Déjà inscrit ? <Link to="/login">Se connecter</Link>
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="name">Nom</label>
              <input
                id="name"
                type="text"
                placeholder="Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div className="auth-field">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="auth-terms">
            En créant un compte, tu acceptes nos conditions d'utilisation.
          </p>
        </div>
      </div>

      <div className="auth-visual-panel">
        <div className="auth-visual-content">
          <p className="auth-visual-eyebrow">Rejoins la communauté</p>
          <h2 className="auth-visual-heading">
            Découvre les meilleurs produits, chaque jour.
          </h2>

          <div className="auth-preview-stack">
            <div className="auth-preview-card">
              <div className="auth-preview-logo" style={{ background: '#7C6CF4' }}>N</div>
              <div className="auth-preview-info">
                <h4>Notion Lite</h4>
                <p>Un second cerveau, en plus simple</p>
              </div>
              <span className="auth-preview-votes">▲ 128</span>
            </div>

            <div className="auth-preview-card">
              <div className="auth-preview-logo" style={{ background: '#FFB800' }}>F</div>
              <div className="auth-preview-info">
                <h4>FocusFlow</h4>
                <p>Le pomodoro qui s'adapte à toi</p>
              </div>
              <span className="auth-preview-votes">▲ 96</span>
            </div>

            <div className="auth-preview-card">
              <div className="auth-preview-logo" style={{ background: '#211F30' }}>D</div>
              <div className="auth-preview-info">
                <h4>DevSnap</h4>
                <p>Des captures de code, jolies</p>
              </div>
              <span className="auth-preview-votes">▲ 74</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}