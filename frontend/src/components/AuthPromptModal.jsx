import './AuthPromptModal.css'

export default function AuthPromptModal({ message, onLogin, onClose }) {
  return (
    <div className="auth-prompt-overlay" onClick={onClose}>
      <div
        className="auth-prompt-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-prompt-title"
        onClick={e => e.stopPropagation()}
      >
        <h3 id="auth-prompt-title">Connexion requise</h3>
        <p>{message}</p>
        <div className="auth-prompt-actions">
          <button className="btn btn-primary" onClick={onLogin}>Se connecter</button>
          <button className="btn btn-secondary" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  )
}