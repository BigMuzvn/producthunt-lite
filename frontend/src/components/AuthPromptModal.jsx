import './AuthPromptModal.css'

export default function AuthPromptModal({ message, onLogin, onClose }) {
  return (
    <div className="auth-prompt-overlay" onClick={onClose}>
      <div className="auth-prompt-modal" onClick={e => e.stopPropagation()}>
        <h3>Connexion requise</h3>
        <p>{message}</p>
        <div className="auth-prompt-actions">
          <button className="btn btn-primary" onClick={onLogin}>Se connecter</button>
          <button className="btn btn-secondary" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  )
}