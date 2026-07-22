import { testimonials } from '../data/testimonials'

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L14.5 8.5L21 9.3L16.5 13.9L17.8 20.5L12 17.3L6.2 20.5L7.5 13.9L3 9.3L9.5 8.5L12 2Z" />
    </svg>
  )
}

function Testimonials() {
  return (
    <section id="testimonials" className="container">
      <div className="section-header">
        <p className="section-eyebrow">Avis vérifiés</p>
        <h2>Ce que dit la communauté</h2>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-stars">
              <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
            </div>
            <p className="testimonial-quote">"{testimonial.quote}"</p>
            <div className="testimonial-author">
              <img src={testimonial.avatarUrl} alt={testimonial.name} className="testimonial-avatar" />
              <div>
                <div className="testimonial-name">{testimonial.name}</div>
                <div className="testimonial-role">{testimonial.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials