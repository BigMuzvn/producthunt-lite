import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../services/category.service'

const categoryMeta = {
  'Intelligence artificielle': {
    desc: 'LLMs, agents intelligents, vision & générateurs',
    tag: 'Tendance IA',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a8 8 0 0 0-8 8c0 3.36 2.07 6.23 5 7.42V20a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.58c2.93-1.19 5-4.06 5-7.42a8 8 0 0 0-8-8z"/>
        <line x1="9.5" y1="9" x2="9.5" y2="9.01"/>
        <line x1="14.5" y1="9" x2="14.5" y2="9.01"/>
        <path d="M9.5 13a3.5 3.5 0 0 0 5 0"/>
      </svg>
    )
  },
  'Développement': {
    desc: 'Devtools, APIs, frameworks, boilerplates & SDKs',
    tag: 'Pour Devs',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
        <line x1="14" y1="4" x2="10" y2="20"/>
      </svg>
    )
  },
  'Design': {
    desc: 'UI/UX kits, icônes, animations & design systems',
    tag: 'Créatifs',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
      </svg>
    )
  },
  'Productivité': {
    desc: 'Automatisation, gestion du temps & focus',
    tag: 'Gain de temps',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    )
  },
  'Finance': {
    desc: 'Fintech, facturation, crypto & trésorerie',
    tag: 'Business',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    )
  },
  'Marketing': {
    desc: 'Growth, SEO, cold email & acquisition client',
    tag: 'Croissance',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 11 18-5v12L3 14v-3z"/>
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
      </svg>
    )
  },
  'Gestion': {
    desc: 'CRM, collaboration, Kanban & pilotage d’équipe',
    tag: 'Management',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2"/>
        <path d="M9 3v18"/>
        <path d="M15 9h6"/>
        <path d="M15 15h6"/>
      </svg>
    )
  },
  'Mode': {
    desc: 'Lifestyle, e-commerce, tendances & shopping',
    tag: 'Lifestyle',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
        <path d="M3 6h18"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    )
  }
}

const defaultMeta = {
  desc: 'Découvrez tous les outils et innovations tech',
  tag: 'Découverte',
  icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15"/>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/>
      <path d="M12 22V12"/>
    </svg>
  )
}

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories()
        setCategories(data || [])
      } catch (err) {
        console.error(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) return null

  return (
    <section id="categories" className="categories-showcase-section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Explore par Thématique</span>
          <h2>Explorez les catégories en vogue</h2>
          <p>
            Trouvez instantanément les pépites logicielles et les outils adaptés à vos besoins de création et de productivité.
          </p>
        </div>

        <div className="categories-cards-grid">
          {categories.map(category => {
            const meta = categoryMeta[category.name] || defaultMeta
            const categoryColor = category.color || 'var(--accent)'

            return (
              <div
                key={category._id}
                className="category-card-pro"
                onClick={() => navigate(`/categories?categoryId=${category._id}`)}
              >
                <div className="category-card-top">
                  <div 
                    className="category-card-icon"
                    style={{
                      background: `rgba(${parseInt(categoryColor.slice(1,3),16) || 99}, ${parseInt(categoryColor.slice(3,5),16) || 102}, ${parseInt(categoryColor.slice(5,7),16) || 241}, 0.15)`,
                      color: categoryColor,
                      borderColor: `rgba(${parseInt(categoryColor.slice(1,3),16) || 99}, ${parseInt(categoryColor.slice(3,5),16) || 102}, ${parseInt(categoryColor.slice(5,7),16) || 241}, 0.3)`
                    }}
                  >
                    {meta.icon}
                  </div>
                  <span className="category-card-tag">{meta.tag}</span>
                </div>

                <div className="category-card-content">
                  <h3 className="category-card-title">{category.name}</h3>
                  <p className="category-card-desc">{meta.desc}</p>
                </div>

                <div className="category-card-footer">
                  <span className="category-explore-link">
                    Explorer la catégorie
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="category-arrow-icon">
                      <path d="M5 12h14"/>
                      <path d="m12 5 7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Categories