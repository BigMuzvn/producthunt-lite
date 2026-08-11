function StoreRatings() {
  return (
    <section className="store-ratings">
      <div className="container store-ratings-inner">
        <div className="store-card">
          <div className="store-card-icon store-card-icon-dark">
            <img src="/src/assets/playstore.png" alt="logo-Play Store" />
          </div>
          <div className="store-card-content">
            <div className="store-card-score">Web & Mobile</div>
            <div className="store-card-source">100% Responsive et ultra fluide sur tous vos écrans</div>
          </div>
        </div>

        <div className="store-card">
          <div className="store-card-icon store-card-icon-accent">
            <img src="/src/assets/apple-logo.png" alt="logo-App Store" />
          </div>
          <div className="store-card-content">
            <div className="store-card-score">Makers & Startups</div>
            <div className="store-card-source">Propulsez vos projets et obtenez vos premiers utilisateurs</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StoreRatings