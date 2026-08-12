function TrustBanner() {
  const partners = [
    {
      name: 'Y Combinator',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect width="24" height="24" rx="4" fill="#FF6600"/>
          <path d="M7 6l4.5 7.5V18h2v-4.5L18 6h-2.2l-3.3 5.7L9.2 6H7z" fill="#FFF"/>
        </svg>
      )
    },
    {
      name: 'TechCrunch',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect width="24" height="24" rx="4" fill="rgba(255,255,255,0.08)"/>
          <text x="5" y="16" fontFamily="var(--font-display)" fontSize="11" fontWeight="900" fill="#00D664">TC</text>
        </svg>
      )
    },
    {
      name: 'GitHub',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.92.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2z"/>
        </svg>
      )
    },
    {
      name: 'Vercel',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 22.525H0l12-21.05 12 21.05z"/>
        </svg>
      )
    },
    {
      name: 'Product Hunt',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.6 8.4h-3.2v3.2h3.2c.88 0 1.6-.72 1.6-1.6s-.72-1.6-1.6-1.6zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.6 12H10.4v3.6H8V6h5.6c2.2 0 4 1.8 4 4s-1.8 4-4 4z" fill="#DA552F"/>
        </svg>
      )
    },
    {
      name: 'Hacker News',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <rect width="24" height="24" rx="4" fill="#FF6600"/>
          <text x="7" y="17" fontFamily="monospace" fontSize="14" fontWeight="bold" fill="#FFF">Y</text>
        </svg>
      )
    },
    {
      name: 'Stripe',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#6366F1' }}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      )
    }
  ]

  const loopedPartners = [...partners, ...partners, ...partners]

  return (
    <section className="trust-banner">
      <div className="container trust-banner-content">
        <p className="trust-eyebrow">PROPULSÉ PAR L'ÉCOSYSTÈME TECH MONDIAL</p>
      </div>

      <div className="marquee">
        <div className="marquee-track">
          {loopedPartners.map((item, index) => (
            <div key={index} className="marquee-brand-item">
              <span className="marquee-brand-icon">{item.icon}</span>
              <span className="marquee-brand-name">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBanner