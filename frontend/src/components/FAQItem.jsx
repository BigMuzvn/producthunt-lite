function renderFaqIcon(iconType) {
  switch (iconType) {
    case 'pricing':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      )
    case 'launch':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        </svg>
      )
    case 'votes':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )
    case 'manage':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
        </svg>
      )
    case 'notifications':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </svg>
      )
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      )
  }
}

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className={`faq-item-pro ${isOpen ? 'faq-item-open' : ''}`}>
      <button
        type="button"
        className="faq-question-pro"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="faq-question-left">
          <div 
            className="faq-icon-badge"
            style={{
              background: `rgba(99, 102, 241, 0.12)`,
              color: item.color,
              borderColor: `rgba(255, 255, 255, 0.1)`
            }}
          >
            {renderFaqIcon(item.iconType)}
          </div>
          <div className="faq-text-wrapper">
            <span className="faq-category-pill">{item.category}</span>
            <h3 className="faq-question-title">{item.question}</h3>
          </div>
        </div>

        <div className="faq-chevron-circle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="faq-chevron-svg">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      <div className="faq-answer-wrapper">
        <div className="faq-answer-content">
          <p className="faq-answer-text">{item.answer}</p>
        </div>
      </div>
    </div>
  )
}

export default FAQItem