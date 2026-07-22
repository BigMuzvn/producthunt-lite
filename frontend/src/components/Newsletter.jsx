import { useState } from 'react'

function Newsletter() {
  const [email, setEmail] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    console.log('Email inscrit :', email)
    setEmail('')
  }

  return (
    <section className="newsletter">
      <div className="container newsletter-inner">
        <div>
  <p className="section-eyebrow">Ne rate rien</p>
  <h2>Reste informé</h2>
  <p className="newsletter-subtext">Reçois les nouveaux produits chaque semaine, directement par email.</p>
</div>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">S'abonner</button>
        </form>
      </div>
    </section>
  )
}

export default Newsletter