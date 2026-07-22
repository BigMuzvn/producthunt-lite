import { useState, useEffect } from 'react'
import { getCategories } from '../services/category.service'
import CategoryTag from './CategoryTag'

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories()
        setCategories(data)
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
    <section id="categories">
      <div className="container">
        <div className="section-header">
        <p className="section-eyebrow">Explore par centre d'intérêt</p>
        <h2>Catégories populaires</h2>
      </div>
        <div className="categories-list categories-list-center">
          {categories.map(category => (
            <CategoryTag key={category._id} {...category} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories