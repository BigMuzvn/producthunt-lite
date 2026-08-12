const testimonialsList = [
  {
    id: 1,
    name: 'Léa Fontaine',
    role: 'Product Designer @ NovaUI',
    badge: 'Maker Vérifié',
    metricText: '+3,400 visiteurs le jour du launch',
    metricIcon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cyan)' }}>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #6366F1 0%, #38BDF8 100%)',
    avatarInitials: 'LF',
    quote: 'Je découvre chaque matin des outils tech et des inspirations UI que je n’aurais jamais trouvés ailleurs. La qualité de la curation est bluffante.'
  },
  {
    id: 2,
    name: 'Karim Belaïd',
    role: 'Fondateur @ PromptCraft AI',
    badge: 'Top #1 du Jour',
    metricText: '480 upvotes & 120 clients',
    metricIcon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#FBBF24' }}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
    avatarInitials: 'KB',
    quote: 'Nous avons propulsé notre SaaS sur ProductHunt Lite et obtenu nos 100 premiers utilisateurs payants en moins de 48 heures. Le retour sur investissement est exceptionnel.'
  },
  {
    id: 3,
    name: 'Sophie Marchand',
    role: 'Indie Hacker & Fullstack Dev',
    badge: '3 Lancements Réussis',
    metricText: '45 retours constructifs',
    metricIcon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#34D399' }}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
    avatarInitials: 'SM',
    quote: 'La communauté est bienveillante, hyper réactive et les retours reçus m’ont permis d’itérer rapidement sur ma roadmap. Un incontournable pour tout builder.'
  }
]

function Testimonials() {
  return (
    <section id="testimonials" className="testimonials-showcase-section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Avis Vérifiés</span>
          <h2>Ce que dit la communauté des Makers</h2>
          <p>
            Découvrez l’expérience de ceux qui lancent, découvrent et font grandir leurs projets avec nous.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonialsList.map((t) => (
            <div key={t.id} className="testimonial-card-pro">
              <div className="testimonial-card-header">
                <div className="testimonial-stars-row">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FBBF24" className="star-icon-glow">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <span className="testimonial-badge-verified">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cyan)' }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {t.badge}
                </span>
              </div>

              <p className="testimonial-quote-pro">
                « {t.quote} »
              </p>

              <div className="testimonial-metric-pill">
                <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: 6 }}>
                  {t.metricIcon}
                </span>
                <span>{t.metricText}</span>
              </div>

              <div className="testimonial-author-pro">
                <div className="testimonial-avatar-gradient" style={{ background: t.gradient }}>
                  {t.avatarInitials}
                </div>
                <div>
                  <div className="testimonial-author-name">{t.name}</div>
                  <div className="testimonial-author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials