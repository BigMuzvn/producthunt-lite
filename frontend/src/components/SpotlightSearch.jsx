import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../services/product.service'
import './SpotlightSearch.css'

export default function SpotlightSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
      if (products.length === 0) {
        setLoading(true)
        getProducts().then(res => {
          setProducts(Array.isArray(res) ? res : [])
          setLoading(false)
        }).catch(() => setLoading(false))
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setFilteredProducts(products.slice(0, 5))
    } else {
      const q = query.toLowerCase().trim()
      const matches = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        (p.categoryId?.name && p.categoryId.name.toLowerCase().includes(q)) ||
        (p.makerId?.name && p.makerId.name.toLowerCase().includes(q))
      )
      setFilteredProducts(matches.slice(0, 8))
    }
  }, [query, products])

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else {
          // Trigger open via custom event or prop
          window.dispatchEvent(new CustomEvent('open-spotlight'))
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleSelectProduct(id) {
    onClose()
    navigate(`/products/${id}`)
  }

  function handleSelectMaker(makerId, e) {
    e.stopPropagation()
    onClose()
    navigate(`/maker/${makerId}`)
  }

  return (
    <div className="spotlight-overlay" onClick={onClose}>
      <div className="spotlight-modal" onClick={e => e.stopPropagation()}>
        <div className="spotlight-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="spotlight-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher un produit, une catégorie ou un maker (Cmd + K)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="spotlight-input"
          />
          <span className="spotlight-kbd">ESC</span>
        </div>

        <div className="spotlight-results">
          {loading && <p className="spotlight-status">Chargement du catalogue...</p>}

          {!loading && filteredProducts.length === 0 && (
            <p className="spotlight-status">Aucun produit ou maker trouvé pour "{query}".</p>
          )}

          {!loading && filteredProducts.map(p => (
            <div key={p._id} className="spotlight-item" onClick={() => handleSelectProduct(p._id)}>
              <img
                src={p.logoUrl || 'https://placehold.co/40/1e293b/ffffff?text=' + encodeURIComponent(p.name?.charAt(0) || 'P')}
                alt={p.name}
                className="spotlight-logo"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/40/1e293b/ffffff?text=' + encodeURIComponent(p.name?.charAt(0) || 'P')
                }}
              />
              <div className="spotlight-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong className="spotlight-title">{p.name}</strong>
                  {p.categoryId?.name && (
                    <span className="spotlight-tag" style={{ background: p.categoryId.color + '22', color: p.categoryId.color || '#38BDF8' }}>
                      {p.categoryId.name}
                    </span>
                  )}
                </div>
                <p className="spotlight-sub">{p.tagline}</p>
              </div>

              {p.makerId?.name && (
                <button
                  type="button"
                  className="spotlight-maker-btn"
                  onClick={(e) => handleSelectMaker(p.makerId._id || p.makerId, e)}
                  title="Voir le profil du créateur"
                >
                  par {p.makerId.name} ↗
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
