import { useState } from 'react'
import { Link } from 'react-router-dom'
import { faqItems } from '../data/faq'
import FAQItem from './FAQItem'

function FAQ() {
  const [openId, setOpenId] = useState(1)

  function handleToggle(id) {
    setOpenId(prev => (prev === id ? null : id))
  }

  return (
    <section id="faq" className="faq-showcase-section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Centre d'Aide & FAQ</span>
          <h2>Tout ce que vous devez savoir</h2>
          <p>
            Retrouvez les réponses aux questions les plus courantes sur le fonctionnement de la communauté et des lancements.
          </p>
        </div>

        <div className="faq-list-pro">
          {faqItems.map((item) => (
            <FAQItem 
              key={item.id} 
              item={item} 
              isOpen={openId === item.id} 
              onToggle={() => handleToggle(item.id)} 
            />
          ))}
        </div>

        {/* Bannière d'aide & support supplémentaire */}
        <div className="faq-support-card">
          <div className="faq-support-left">
            <div className="faq-support-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cyan)' }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <h4 className="faq-support-title">Vous avez une autre question spécifique ?</h4>
              <p className="faq-support-sub">Notre équipe et la communauté de créateurs vous répondent sous 24 heures.</p>
            </div>
          </div>
          <Link to="/products" className="btn btn-secondary btn-glow" style={{ padding: '10px 20px', fontSize: 13 }}>
            Rejoindre la discussion
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FAQ