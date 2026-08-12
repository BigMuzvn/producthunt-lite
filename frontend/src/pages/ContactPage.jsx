import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WorldMap from '../components/ui/world-map'
import { AnimatedTestimonials } from '../components/ui/animated-testimonials'

const makerTestimonials = [
  {
    quote:
      "ProductHunt Lite a été le véritable tremplin pour notre SaaS. En seulement 48h, nous avons accueilli plus de 1 200 premiers utilisateurs qualifiés et reçu des retours précieux.",
    name: "Alexandre Moreau",
    designation: "Fondateur de Notionly • Paris, France",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1200&auto=format&fit=crop",
  },
  {
    quote:
      "L'interface est d'une fluidité incroyable et la communauté des makers est d'une bienveillance rare. C'est l'endroit idéal pour tester son product-market fit en un clin d'œil.",
    name: "Elena Rostova",
    designation: "Lead Product chez Flowbase • Berlin, Allemagne",
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1200&auto=format&fit=crop",
  },
  {
    quote:
      "Notre lancement sur la plateforme nous a permis de décrocher nos premiers contrats B2B et d'attirer des business angels. Un outil indispensable pour tout créateur tech.",
    name: "David Zhang",
    designation: "CTO & Co-fondateur de Voxa • San Francisco, USA",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    quote:
      "Le support de l'équipe a été exemplaire lors de notre journée de lancement. Les fonctionnalités de vote et d'avis permettent de dialoguer directement avec nos utilisateurs finaux.",
    name: "Camille Laurent",
    designation: "Créatrice indépendante de CloudNest • Lyon, France",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
  },
]

const worldConnections = [
  // Amérique du Nord & Transatlantique
  {
    start: { lat: 37.7749, lng: -122.4194 }, // San Francisco
    end: { lat: 40.7128, lng: -74.006 }, // New York
  },
  {
    start: { lat: 40.7128, lng: -74.006 }, // New York
    end: { lat: 51.5074, lng: -0.1278 }, // Londres
  },
  {
    start: { lat: 40.7128, lng: -74.006 }, // New York
    end: { lat: 48.8566, lng: 2.3522 }, // Paris
  },
  {
    start: { lat: 47.6062, lng: -122.3321 }, // Seattle / Vancouver
    end: { lat: 19.4326, lng: -99.1332 }, // Mexico
  },

  // Amérique du Sud & Connexions Ibériques
  {
    start: { lat: 19.4326, lng: -99.1332 }, // Mexico
    end: { lat: 4.711, lng: -74.0721 }, // Bogota
  },
  {
    start: { lat: 4.711, lng: -74.0721 }, // Bogota
    end: { lat: -23.5505, lng: -46.6333 }, // São Paulo
  },
  {
    start: { lat: -23.5505, lng: -46.6333 }, // São Paulo
    end: { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
  },
  {
    start: { lat: -23.5505, lng: -46.6333 }, // São Paulo
    end: { lat: 38.7223, lng: -9.1393 }, // Lisbonne
  },

  // Europe & Afrique
  {
    start: { lat: 48.8566, lng: 2.3522 }, // Paris
    end: { lat: 52.52, lng: 13.405 }, // Berlin
  },
  {
    start: { lat: 52.52, lng: 13.405 }, // Berlin
    end: { lat: 59.3293, lng: 18.0686 }, // Stockholm
  },
  {
    start: { lat: 38.7223, lng: -9.1393 }, // Lisbonne
    end: { lat: 33.5731, lng: -7.5898 }, // Casablanca
  },
  {
    start: { lat: 48.8566, lng: 2.3522 }, // Paris
    end: { lat: 6.5244, lng: 3.3792 }, // Lagos
  },
  {
    start: { lat: 52.52, lng: 13.405 }, // Berlin
    end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
  },
  {
    start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
    end: { lat: -26.2041, lng: 28.0473 }, // Johannesburg
  },

  // Moyen-Orient & Asie
  {
    start: { lat: 48.8566, lng: 2.3522 }, // Paris
    end: { lat: 25.2048, lng: 55.2708 }, // Dubaï
  },
  {
    start: { lat: 25.2048, lng: 55.2708 }, // Dubaï
    end: { lat: 12.9716, lng: 77.5946 }, // Bengaluru (Inde)
  },
  {
    start: { lat: 12.9716, lng: 77.5946 }, // Bengaluru
    end: { lat: 1.3521, lng: 103.8198 }, // Singapour
  },
  {
    start: { lat: 1.3521, lng: 103.8198 }, // Singapour
    end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
  },
  {
    start: { lat: 37.5665, lng: 126.978 }, // Séoul
    end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
  },

  // Asie-Pacifique & Océanie
  {
    start: { lat: 1.3521, lng: 103.8198 }, // Singapour
    end: { lat: -33.8688, lng: 151.2093 }, // Sydney
  },
  {
    start: { lat: -33.8688, lng: 151.2093 }, // Sydney
    end: { lat: -36.8485, lng: 174.7633 }, // Auckland
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Contact & Communauté — ProductHunt Lite'
    window.scrollTo(0, 0)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSent(true)
    }, 600)
  }

  return (
    <div className="app-shell">
      <Header />

      <main style={{ paddingBottom: 60, minHeight: '80vh' }}>
        {/* =========================================================================
            SECTION 1: HERO & FORMULAIRE DE CONTACT DIRECT
           ========================================================================= */}
        <section style={{ padding: '64px 0 80px', position: 'relative' }}>
          <div className="container">
            {/* Header de la page */}
            <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 9999, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', color: '#A5B4FC', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 16 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Entrons en contact</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4.5vw, 48px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Parlez-nous de votre projet ou posez vos questions
              </h1>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Une demande de partenariat, une suggestion pour la plateforme ou besoin d'accompagnement pour votre prochain lancement ? Notre équipe vous répond sous 24h.
              </p>
            </div>

            {/* Grille Formulaire + Cartes Canaux */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32, alignItems: 'start' }}>
              {/* Formulaire Carte Glassmorphism */}
              <div style={{ background: 'rgba(13, 19, 33, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 24, padding: '36px 32px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)' }}>
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 24px rgba(16, 185, 129, 0.3)' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#FFFFFF', marginBottom: 10 }}>
                      Message transmis avec succès !
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.6, maxWidth: 380, margin: '0 auto 24px' }}>
                      Merci pour votre prise de contact. Notre équipe a bien reçu votre message et reviendra vers vous très rapidement.
                    </p>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setSent(false)
                        setFormData({ name: '', email: '', subject: '', message: '' })
                      }}
                    >
                      Envoyer un nouveau message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>Votre nom</label>
                        <input
                          type="text"
                          placeholder="Alexandre Dupont"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: '12px 16px', color: '#FFFFFF', fontSize: 14, outline: 'none' }}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>Votre email</label>
                        <input
                          type="email"
                          placeholder="alexandre@startup.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: '12px 16px', color: '#FFFFFF', fontSize: 14, outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>Sujet de votre demande</label>
                      <input
                        type="text"
                        placeholder="Lancement d'un produit, Partenariat, Support..."
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: '12px 16px', color: '#FFFFFF', fontSize: 14, outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>Votre message</label>
                      <textarea
                        rows="4"
                        placeholder="Détaillez votre projet, vos questions ou vos objectifs..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: '12px 16px', color: '#FFFFFF', fontSize: 14, outline: 'none', resize: 'vertical' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary btn-glow"
                      style={{ padding: '14px', fontSize: 14.5, fontWeight: 700, width: '100%', marginTop: 6 }}
                    >
                      {submitting ? 'Transmission en cours...' : 'Envoyer le message ↗'}
                    </button>
                  </form>
                )}
              </div>

              {/* Canaux de contact rapides */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: 'rgba(13, 19, 33, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: '24px', display: 'flex', gap: 18, alignItems: 'flex-start', transition: 'all 0.2s ease' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>Support & Équipe</h4>
                    <p style={{ margin: '0 0 8px', fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.45 }}>Pour toute question relative à votre compte ou à vos lancements.</p>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: '#38BDF8' }}>support@producthunt-lite.app</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(13, 19, 33, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: '24px', display: 'flex', gap: 18, alignItems: 'flex-start', transition: 'all 0.2s ease' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>Communauté des Créateurs</h4>
                    <p style={{ margin: '0 0 8px', fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.45 }}>Échangez en direct avec d'autres fondateurs et recueillez du feedback.</p>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: '#818CF8' }}>Rejoindre le Discord (+5 000 Makers)</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(13, 19, 33, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: '24px', display: 'flex', gap: 18, alignItems: 'flex-start', transition: 'all 0.2s ease' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>Disponibilité & Réactivité</h4>
                    <p style={{ margin: '0 0 8px', fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.45 }}>Temps moyen de première réponse estimé à moins de 24h.</p>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: '#34D399' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }}></span>
                      Opérationnel 7j/7
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: ACETERNITY UI COMPOSANT 1 — WORLD MAP CONNECTIVITY
           ========================================================================= */}
        <section style={{ padding: '80px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)', position: 'relative' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 48px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 9999, background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#38BDF8', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 16 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>Portée Mondiale</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
                Une communauté de créateurs connectée à travers le monde
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                De San Francisco à Tokyo, en passant par Paris, Londres et Singapour : découvrez comment les innovateurs lancent et propulsent leurs projets sur ProductHunt Lite sans frontières.
              </p>
            </div>

            {/* Carte du Monde Interactive Animée */}
            <div style={{ background: 'rgba(13, 19, 33, 0.4)', borderRadius: 28, border: '1px solid rgba(255, 255, 255, 0.06)', padding: '24px 16px', boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.6)' }}>
              <WorldMap dots={worldConnections} />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: ACETERNITY UI COMPOSANT 2 — ANIMATED TESTIMONIALS
           ========================================================================= */}
        <section style={{ padding: '80px 0 40px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', position: 'relative' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 32px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 9999, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#34D399', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 16 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>Retours Fondateurs</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
                Ce que disent les créateurs qui se sont lancés
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Découvrez les retours d'expérience authentiques des makers et entrepreneurs qui utilisent ProductHunt Lite au quotidien pour donner de la visibilité à leurs idées.
              </p>
            </div>

            {/* Composant Témoignages Animés */}
            <AnimatedTestimonials testimonials={makerTestimonials} autoplay={true} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
