function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.47 2.07-1.13 2.86-.75.87-1.98 1.55-3.1 1.46-.13-1.1.42-2.24 1.1-2.98.75-.83 2.03-1.44 3.13-1.34zM20.5 17.34c-.53 1.22-.78 1.77-1.47 2.85-.96 1.51-2.32 3.4-4 3.42-1.49.02-1.87-.97-3.89-.96-2.02.01-2.44.98-3.93.96-1.68-.02-2.97-1.72-3.93-3.23-2.7-4.2-2.98-9.13-1.32-11.75 1.18-1.87 3.04-2.96 4.79-2.96 1.78 0 2.9 1.01 4.37 1.01 1.42 0 2.29-1.01 4.35-1.01 1.56 0 3.21.85 4.39 2.32-3.86 2.12-3.23 7.62.64 9.35z"/>
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 3.5c0-.7.75-1.1 1.35-.75l15 8.5c.6.35.6 1.2 0 1.55l-15 8.5c-.6.35-1.35-.05-1.35-.75V3.5z"/>
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L14.5 8.5L21 9.3L16.5 13.9L17.8 20.5L12 17.3L6.2 20.5L7.5 13.9L3 9.3L9.5 8.5L12 2Z" />
    </svg>
  )
}

function StoreRatings() {
  return (
    <section className="store-ratings">
      <div className="container
       store-ratings-inner">
        <div className="store-card">
          <div className="store-card-icon store-card-icon-dark"><AppleIcon /></div>
          <div className="store-card-content">
            <div className="store-card-stars">
              <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
            </div>
            <div className="store-card-score">4.8 <span>/ 5</span></div>
            <div className="store-card-source">App Store · 2 340 avis</div>
          </div>
        </div>

        <div className="store-card">
          <div className="store-card-icon store-card-icon-accent"><PlayIcon /></div>
          <div className="store-card-content">
            <div className="store-card-stars">
              <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
            </div>
            <div className="store-card-score">4.7 <span>/ 5</span></div>
            <div className="store-card-source">Play Store · 1 890 avis</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StoreRatings