const pressLogos = [
  'TechWire',
  'StartUp Daily',
  'The Maker Post',
  'Innovate Weekly',
  "Founder's Digest",
  'Byte & Beyond',
]

function TrustBanner() {
  const loopedLogos = [...pressLogos, ...pressLogos]

  return (
    <section className="trust-banner">
      <div className="container">
        <p className="trust-eyebrow">Ils en parlent</p>
        <h2 className="trust-heading">500+ produits déjà référencés par la communauté</h2>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {loopedLogos.map((logo, index) => (
            <span key={index} className="marquee-item">{logo}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBanner