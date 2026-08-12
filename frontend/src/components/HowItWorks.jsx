const stepsData = [
  {
    step: '01',
    title: 'Détectez les Innovations',
    subtitle: 'Explorez chaque matin le meilleur de la tech',
    desc: 'Naviguez parmi les nouveaux SaaS, IAs et outils créatifs soumis quotidiennement par notre communauté de makers et validés avec soin.',
    pillText: 'Découverte Instantanée',
    pillIcon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cyan)' }}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <path d="m11 8 3 3-3 3"/>
      </svg>
    ),
    color: '#38BDF8'
  },
  {
    step: '02',
    title: 'Votez & Échangez',
    subtitle: 'Soutenez vos projets préférés en 1 clic',
    desc: 'Donnez votre voix pour hisser les projets les plus prometteurs en tête du classement et échangez directement avec leurs fondateurs.',
    pillText: 'Classement Quotidien',
    pillIcon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.45 1-1 1H7"/>
        <path d="M14 14.66V17c0 .55.45 1 1 1h2"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
      </svg>
    ),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    color: '#6366F1'
  },
  {
    step: '03',
    title: 'Propulsez vos Produits',
    subtitle: 'Obtenez vos premiers utilisateurs payants',
    desc: 'Publiez votre startup en quelques minutes, profitez d’un tableau de bord de suivi en direct et touchez des milliers d’early adopters qualifiés.',
    pillText: 'Croissance Accélérée',
    pillIcon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#34D399' }}>
        <path d="m18 15-6-6-6 6"/>
      </svg>
    ),
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      </svg>
    ),
    color: '#10B981'
  }
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works-showcase-section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Parcours Simple & Efficace</span>
          <h2>Comment fonctionne la plateforme</h2>
          <p>
            Que vous soyez curieux de nouveautés ou fondateur prêt à lancer, trois étapes suffisent pour transformer votre expérience.
          </p>
        </div>

        <div className="steps-container-pro">
          <div className="steps-grid-pro">
            {stepsData.map((step, index) => (
              <div key={step.step} className="step-card-pro">
                <div className="step-card-top-pro">
                  <div className="step-number-badge" style={{ color: step.color }}>
                    {step.step}
                  </div>
                  <div 
                    className="step-icon-wrapper"
                    style={{
                      background: `rgba(99, 102, 241, 0.12)`,
                      color: step.color,
                      borderColor: `rgba(255, 255, 255, 0.1)`
                    }}
                  >
                    {step.icon}
                  </div>
                </div>

                <div className="step-card-body-pro">
                  <span className="step-feature-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {step.pillIcon}
                    <span>{step.pillText}</span>
                  </span>
                  <h3 className="step-title-pro">{step.title}</h3>
                  <h4 className="step-subtitle-pro">{step.subtitle}</h4>
                  <p className="step-desc-pro">{step.desc}</p>
                </div>

                {index < stepsData.length - 1 && (
                  <div className="step-connector-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cyan)' }}>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks