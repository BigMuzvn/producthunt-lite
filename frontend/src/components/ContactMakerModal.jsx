import './ContactMakerModal.css'

export default function ContactMakerModal({ maker, onClose }) {
  if (!maker) return null

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="contact-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <div className="contact-modal-header">
          <div>
            <span className="contact-eyebrow">CONTACT MAKER</span>
            <h2 className="contact-title">Contacter {maker.name}</h2>
          </div>
          <button className="settings-close" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <div className="contact-modal-body">
          <p className="contact-desc">
            Pour toute proposition de partenariat, question sur ses produits ou opportunité professionnelle, vous pouvez joindre {maker.name} via :
          </p>

          <div className="contact-links-grid">
            <a href={`mailto:${maker.email}`} className="contact-card-btn primary-contact">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <div>
                <strong>Envoyer un Email</strong>
                <span>{maker.email}</span>
              </div>
            </a>

            {maker.twitterUrl && (
              <a href={maker.twitterUrl} target="_blank" rel="noopener noreferrer" className="contact-card-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <div>
                  <strong>Envoyer un DM sur X (Twitter)</strong>
                  <span>Profil officiel ↗</span>
                </div>
              </a>
            )}

            {maker.githubUrl && (
              <a href={maker.githubUrl} target="_blank" rel="noopener noreferrer" className="contact-card-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.92.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2z"/>
                </svg>
                <div>
                  <strong>Consulter le GitHub</strong>
                  <span>Projets & dépôts ↗</span>
                </div>
              </a>
            )}

            {maker.portfolioUrl && (
              <a href={maker.portfolioUrl} target="_blank" rel="noopener noreferrer" className="contact-card-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <div>
                  <strong>Visiter le Portfolio</strong>
                  <span>Site web officiel ↗</span>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
