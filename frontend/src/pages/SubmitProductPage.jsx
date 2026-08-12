import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { createProduct, updateProduct, getProductById } from '../services/product.service'
import { getCategories, createCategory } from '../services/category.service'
import { uploadImage } from '../services/upload.service'
import './SubmitProductPage.css'

export default function SubmitProductPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', tagline: '', description: '', logoUrl: '', websiteUrl: '', contactUrl: '', categoryId: '', status: 'LIVE' })
  const [images, setImages] = useState([])
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false)
  const [isNewCategory, setIsNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = isEdit ? 'Modifier mon produit — ProductHunt Lite' : 'Proposer un produit — ProductHunt Lite'
    getCategories().then(setCategories).catch(() => {})
    if (isEdit) {
      getProductById(id).then(p => {
        setForm({
          name: p.name, tagline: p.tagline, description: p.description,
          logoUrl: p.logoUrl, websiteUrl: p.websiteUrl, contactUrl: p.contactUrl || '',
          categoryId: p.categoryId?._id || '',
          status: p.status || 'LIVE'
        })
        setImages(Array.isArray(p.images) ? p.images : [])
      }).catch(err => setError(err.message))
    }
  }, [id])

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'categoryId' && value === '__new__') {
      setIsNewCategory(true)
      setForm({ ...form, categoryId: '' })
    } else {
      if (name === 'categoryId') setIsNewCategory(false)
      setForm({ ...form, [name]: value })
    }
  }

  function handleLogoFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploadingLogo(true)
    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const res = await uploadImage(evt.target.result)
        setForm({ ...form, logoUrl: res.url })
      } catch (err) {
        setError('Erreur lors du téléversement du logo: ' + err.message)
      } finally {
        setUploadingLogo(false)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleScreenshotsFiles(e) {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    setUploadingScreenshots(true)
    let uploadedUrls = []
    let processed = 0

    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = async (evt) => {
        try {
          const res = await uploadImage(evt.target.result)
          uploadedUrls.push(res.url)
        } catch (err) {
          console.error(err)
        } finally {
          processed++
          if (processed === files.length) {
            setImages(prev => [...prev, ...uploadedUrls])
            setUploadingScreenshots(false)
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  function handleRemoveImage(index) {
    setImages(images.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let categoryId = form.categoryId
      if (isNewCategory) {
        if (!newCategoryName.trim()) throw new Error('Nom de catégorie requis')
        const newCat = await createCategory(newCategoryName.trim())
        categoryId = newCat._id
      }
      const payload = { ...form, categoryId, images }
      if (isEdit) {
        await updateProduct(id, payload)
      } else {
        await createProduct(payload)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selectedCategoryObj = categories.find(c => c._id === form.categoryId)

  return (
    <div className="app-shell">
      <Header />

      <main className="submit-page">
        <div className="submit-layout">
          <form className="submit-form" onSubmit={handleSubmit}>
            <div className="submit-eyebrow-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              </svg>
              <span>{isEdit ? 'ÉDITION DU PRODUIT' : 'NOUVEAU LANCEMENT'}</span>
            </div>

            <h1 className="submit-title">
              {isEdit ? 'Modifiez votre produit' : 'Propulsez votre création'}
            </h1>
            <p className="submit-subtext">
              Partagez votre outil, startup ou projet logiciel avec la communauté des makers.
            </p>

            {error && <div className="auth-error">{error}</div>}

            <div className="form-field">
              <label htmlFor="product-name">Nom du produit</label>
              <input
                id="product-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Notionly, Flowbase..."
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="product-tagline">Accroche / Tagline courte</label>
              <input
                id="product-tagline"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                placeholder="Une phrase concise qui résume la valeur de votre produit"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="product-description">Description détaillée</label>
              <textarea
                id="product-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Expliquez en quoi votre produit résout un problème concrètement..."
                rows={5}
                required
              />
            </div>

            {/* Logo URL & File Upload */}
            <div className="form-field">
              <label htmlFor="product-logo">Logo du produit</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <input
                  id="product-logo"
                  name="logoUrl"
                  value={form.logoUrl}
                  onChange={handleChange}
                  placeholder="Collez une URL d'image (https://...) ou téléversez ci-contre"
                  style={{ flex: 1 }}
                />
                <label className="btn btn-secondary" style={{ flexShrink: 0, padding: '11px 14px', cursor: 'pointer', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span>Téléverser</span>
                  <input type="file" accept="image/*" onChange={handleLogoFile} style={{ display: 'none' }} />
                </label>
              </div>
              {uploadingLogo && <p style={{ fontSize: 12, color: '#38BDF8' }}>Téléversement du logo en cours...</p>}
            </div>

            {/* Captures d'écran / Screenshots Upload */}
            <div className="form-field">
              <label>Captures d'écran & Mockups (Galerie Carrousel)</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                <label className="btn btn-secondary" style={{ padding: '11px 16px', cursor: 'pointer', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>Ajouter des captures d'écran depuis mon ordinateur</span>
                  <input type="file" accept="image/*" multiple onChange={handleScreenshotsFiles} style={{ display: 'none' }} />
                </label>
              </div>
              {uploadingScreenshots && <p style={{ fontSize: 12, color: '#38BDF8' }}>Téléversement des captures en cours...</p>}

              {images.length > 0 && (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                  {images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', width: 90, height: 60, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <img src={img} alt={`screenshot ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="product-website">Lien du Site web officiel</label>
                <input
                  id="product-website"
                  name="websiteUrl"
                  value={form.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://votreproduit.com"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="product-contact">Réseau social(Optionnel)</label>
                <input
                  id="product-contact"
                  name="contactUrl"
                  value={form.contactUrl}
                  onChange={handleChange}
                  placeholder="https://x.com/votre_pseudo"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="product-category">Catégorie thématique</label>
              <select
                id="product-category"
                name="categoryId"
                value={isNewCategory ? '__new__' : form.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez une catégorie...</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                <option value="__new__">+ Créer une nouvelle catégorie</option>
              </select>
            </div>

            {isNewCategory && (
              <div className="form-field" style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: 16, borderRadius: 14 }}>
                <label htmlFor="new-category-name" style={{ color: '#818CF8' }}>Nom de la nouvelle catégorie</label>
                <input
                  id="new-category-name"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder="Ex: Éducation & Apprentissage"
                  required
                />
              </div>
            )}

            <div className="form-field">
              <label htmlFor="product-status">Statut de développement</label>
              <select
                id="product-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="LIVE">En Ligne / Production</option>
                <option value="BETA">Bêta Ouverte / Test</option>
                <option value="OPEN_SOURCE">Open Source</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary submit-btn btn-glow" disabled={loading || uploadingLogo || uploadingScreenshots}>
              {loading ? 'Envoi en cours...' : isEdit ? 'Enregistrer les modifications' : 'Publier mon produit'}
            </button>
          </form>

          {/* Panneau latéral d'Aperçu en Direct */}
          <div className="submit-preview-sidebar">
            <p className="submit-preview-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Aperçu en direct sur le site</span>
            </p>

            <div className="preview-card-wrapper">
              <div className="preview-card">
                <img
                  src={form.logoUrl || 'https://placehold.co/52/1e293b/ffffff?text=' + encodeURIComponent(form.name?.charAt(0) || 'P')}
                  alt="Aperçu Logo"
                  className="preview-logo"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/52/1e293b/ffffff?text=' + encodeURIComponent(form.name?.charAt(0) || 'P')
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <h4 className="preview-title">{form.name || 'Nom de votre produit'}</h4>
                    {(selectedCategoryObj || isNewCategory) && (
                      <span className="category-tag">
                        <span className="category-dot" style={{ background: selectedCategoryObj?.color || '#38BDF8' }}></span>
                        {isNewCategory ? (newCategoryName || 'Nouvelle Catégorie') : selectedCategoryObj?.name}
                      </span>
                    )}
                    <span className={`product-status-pill status-${(form.status || 'LIVE').toLowerCase()}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                      <span className="status-dot" />
                      {form.status === 'BETA' ? 'Bêta' : form.status === 'OPEN_SOURCE' ? 'Open Source' : 'En Ligne'}
                    </span>
                  </div>
                  <p className="preview-tagline">{form.tagline || 'Votre accroche concise s’affichera ici.'}</p>
                </div>
                <span className="votes-badge">▲ 0</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}