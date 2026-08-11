import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { createProduct, updateProduct, getProductById } from '../services/product.service'
import { getCategories, createCategory } from '../services/category.service'
import './SubmitProductPage.css'

export default function SubmitProductPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', tagline: '', description: '', logoUrl: '', websiteUrl: '', contactUrl: '', categoryId: '' })
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
          categoryId: p.categoryId?._id || ''
        })
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
      const payload = { ...form, categoryId }
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

  return (
    <>
      <Header />
      <div className="submit-page">
        <div className="submit-layout">
          <form className="submit-form" onSubmit={handleSubmit}>
            <p className="submit-eyebrow">{isEdit ? 'Modifier' : 'Nouveau produit'}</p>
            <h1 className="submit-title">{isEdit ? 'Modifie ton produit' : 'Soumets ton produit'}</h1>
            <p className="submit-subtext">Partage ce que tu as créé avec la communauté.</p>

            {error && <div className="auth-error">{error}</div>}

            <div className="form-field">
              <label htmlFor="product-name">Nom du produit</label>
              <input id="product-name" name="name" value={form.name} onChange={handleChange} placeholder="Notionly" required />
            </div>

            <div className="form-field">
              <label htmlFor="product-tagline">Tagline</label>
              <input id="product-tagline" name="tagline" value={form.tagline} onChange={handleChange} placeholder="Une phrase qui résume ton produit" required />
            </div>

            <div className="form-field">
              <label htmlFor="product-description">Description</label>
              <textarea id="product-description" name="description" value={form.description} onChange={handleChange} placeholder="Décris ton produit en détail" rows={4} required />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="product-logo">Logo (URL)</label>
                <input id="product-logo" name="logoUrl" value={form.logoUrl} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="form-field">
                <label htmlFor="product-website">Site web</label>
                <input id="product-website" name="websiteUrl" value={form.websiteUrl} onChange={handleChange} placeholder="https://..." required />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="product-contact">Contact / réseau social (optionnel)</label>
              <input id="product-contact" name="contactUrl" value={form.contactUrl} onChange={handleChange} placeholder="https://twitter.com/toncompte" />
            </div>

            <div className="form-field">
              <label htmlFor="product-category">Catégorie</label>
              <select id="product-category" name="categoryId" value={isNewCategory ? '__new__' : form.categoryId} onChange={handleChange} required>
                <option value="">Choisir une catégorie</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                <option value="__new__">+ Ajouter une nouvelle catégorie</option>
              </select>
            </div>

            {isNewCategory && (
              <div className="form-field">
                <label htmlFor="new-category-name">Nom de la nouvelle catégorie</label>
                <input id="new-category-name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Ex: Éducation" required />
              </div>
            )}

            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              {loading ? 'Envoi...' : isEdit ? 'Enregistrer les modifications' : 'Publier mon produit'}
            </button>
          </form>

          <div className="submit-preview">
            <p className="submit-preview-label">Aperçu</p>
            <div className="preview-card">
              <img src={form.logoUrl || 'https://placehold.co/48'} alt="" className="preview-logo" />
              <div>
                <h4>{form.name || 'Nom du produit'}</h4>
                <p>{form.tagline || 'Ta tagline apparaîtra ici'}</p>
              </div>
              <span className="votes-badge">▲ 0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}