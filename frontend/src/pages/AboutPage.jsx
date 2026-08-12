import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Timeline } from '../components/ui/timeline'

const timelineData = [
  {
    title: "2026",
    content: (
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 9999, background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38BDF8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span>Version 2.4 — L'Écosystème Intelligent</span>
        </div>
        <p style={{ fontSize: 15, color: '#CBD5E1', lineHeight: 1.6, margin: '0 0 20px' }}>
          Refonte intégrale avec un design ultra-premium, intégration de la veille technologique hebdomadaire, système d'avis et discussions instantanées, et ouverture d'outils analytiques avancés pour les créateurs.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <div style={{ background: 'rgba(13, 19, 33, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: '20px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: 16, color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>Analytics Fondateurs</h4>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>Suivi des conversions, des upvotes en direct et des clics générés vers vos produits.</p>
          </div>

          <div style={{ background: 'rgba(13, 19, 33, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: '20px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: 16, color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>Discussions Directes</h4>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>Échanges fluides entre makers et premiers adoptants pour itérer rapidement.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2025",
    content: (
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 9999, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>Expansion Internationale</span>
        </div>
        <p style={{ fontSize: 15, color: '#CBD5E1', lineHeight: 1.6, margin: '0 0 20px' }}>
          La communauté franchit le cap des 5 000 membres actifs. Lancement des filtres thématiques par industrie, des badges de vérification créateurs et d'une infrastructure haute disponibilité.
        </p>
        <div style={{ background: 'rgba(13, 19, 33, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: '20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#E2E8F0' }}>
            <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
            <span>Plus de 1 200 projets innovants propulsés sur la scène internationale</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#E2E8F0' }}>
            <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
            <span>Algorithme de vote transparent et sécurisé contre la fraude</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#E2E8F0' }}>
            <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
            <span>Création du Club Discord des Makers francophones et internationaux</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2024",
    content: (
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', borderRadius: 9999, background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#A5B4FC', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
          <span>La Genèse du Projet</span>
        </div>
        <p style={{ fontSize: 15, color: '#CBD5E1', lineHeight: 1.6, margin: '0 0 16px' }}>
          Constatant que les plateformes de lancement traditionnelles devenaient saturées, payantes et complexes, ProductHunt Lite a été créé avec un crédo simple : <strong>offrir une vitrine épurée, 100% gratuite et ultra-rapide</strong> aux makers indépendants.
        </p>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
          Première version alpha construite avec la stack React 18, Node.js & Express, adoptée dès le premier mois par plus de 100 fondateurs pionniers.
        </p>
      </div>
    ),
  },
]

export default function AboutPage() {
  useEffect(() => {
    document.title = 'À propos — ProductHunt Lite'
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="app-shell">
      <Header />

      <main style={{ paddingBottom: 80, minHeight: '80vh' }}>
        {/* =========================================================================
            SECTION 1: HERO & MANIFESTE
           ========================================================================= */}
        <section style={{ padding: '72px 0 64px', position: 'relative' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 60px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 9999, background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', color: '#A5B4FC', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 18 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>Notre Histoire & Notre Mission</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4.5vw, 50px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 20px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Donner une scène aux bâtisseurs de l'innovation tech
              </h1>
              <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                ProductHunt Lite est né d'une volonté simple : démocratiser la découverte et le lancement de nouveaux projets logiciels. Nous offrons à chaque créateur un tremplin gratuit pour tester son idée et toucher ses premiers utilisateurs.
              </p>
            </div>

            {/* 4 Cartes d'Impact Métriques */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              <div style={{ background: 'rgba(13, 19, 33, 0.72)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: '28px 24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}>
                <span style={{ display: 'block', fontSize: 38, fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #FFFFFF, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>
                  5,000+
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#94A3B8' }}>Créateurs & Fondateurs</span>
              </div>

              <div style={{ background: 'rgba(13, 19, 33, 0.72)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: '28px 24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}>
                <span style={{ display: 'block', fontSize: 38, fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #FFFFFF, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>
                  1,200+
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#94A3B8' }}>Produits Propulsés</span>
              </div>

              <div style={{ background: 'rgba(13, 19, 33, 0.72)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: '28px 24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}>
                <span style={{ display: 'block', fontSize: 38, fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #FFFFFF, #34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>
                  48,000+
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#94A3B8' }}>Votes Communautaires</span>
              </div>

              <div style={{ background: 'rgba(13, 19, 33, 0.72)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: '28px 24px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}>
                <span style={{ display: 'block', fontSize: 38, fontWeight: 800, fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #FFFFFF, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>
                  100%
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#94A3B8' }}>Gratuit & Sans friction</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: ACETERNITY UI TIMELINE ANIMÉE
           ========================================================================= */}
        <section style={{ padding: '80px 0 60px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', position: 'relative' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 48px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 9999, background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#38BDF8', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 16 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Notre Évolution</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
                De l'idée initiale à l'écosystème tech
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Découvrez les jalons qui ont façonné ProductHunt Lite pour en faire un hub moderne de partage technologique.
              </p>
            </div>

            {/* Composant Timeline Aceternity UI */}
            <Timeline data={timelineData} />
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: NOS VALEURS FONDATRICES (BENTO GRID)
           ========================================================================= */}
        <section style={{ padding: '80px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 52px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 9999, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#34D399', fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 16 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Nos Principes</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
                Ce qui guide chacune de nos décisions
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              <div style={{ background: 'rgba(13, 19, 33, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: '32px 28px', transition: 'transform 0.2s ease' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#FFFFFF', margin: '0 0 10px' }}>Équité & Transparence</h3>
                <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Chaque projet a sa chance. Aucun passe-droit, un algorithme d'upvote public et une mise en avant purement basée sur l'intérêt de la communauté.
                </p>
              </div>

              <div style={{ background: 'rgba(13, 19, 33, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: '32px 28px', transition: 'transform 0.2s ease' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#FFFFFF', margin: '0 0 10px' }}>Vitesse & Simplicité</h3>
                <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Pas de formulaires interminables. Soumettez votre produit en moins de 2 minutes et commencez à récolter du feedback dès la première heure.
                </p>
              </div>

              <div style={{ background: 'rgba(13, 19, 33, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: '32px 28px', transition: 'transform 0.2s ease' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#FFFFFF', margin: '0 0 10px' }}>Esprit d'Entraide</h3>
                <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Une communauté bienveillante de créateurs qui s'entraident, partagent leurs conseils techniques et célèbrent ensemble chaque jalon.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: FINAL CTA HUB
           ========================================================================= */}
        <section style={{ padding: '60px 0 20px' }}>
          <div className="container">
            <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.1) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 28, padding: '56px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 14px' }}>
                Prêt à propulser votre prochaine idée ?
              </h2>
              <p style={{ fontSize: 16, color: '#CBD5E1', maxWidth: 540, margin: '0 auto 32px', lineHeight: 1.6 }}>
                Rejoignez des milliers de fondateurs et partagez votre produit avec la communauté en quelques clics.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/submit" className="btn btn-primary btn-glow" style={{ padding: '14px 28px', fontSize: 15 }}>
                  + Soumettre mon produit
                </Link>
                <Link to="/contact" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: 15 }}>
                  Contacter l'équipe
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
