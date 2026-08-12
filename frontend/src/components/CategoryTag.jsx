import { useNavigate } from 'react-router-dom'

function CategoryTag({ _id, name, color }) {
  const navigate = useNavigate()

  function handleClick(e) {
    e.stopPropagation()
    if (_id) {
      navigate(`/categories?categoryId=${_id}`)
    } else {
      navigate('/categories')
    }
  }

  return (
    <button className="category-tag" onClick={handleClick} type="button">
      <span className="category-dot" style={{ backgroundColor: color || 'var(--accent)' }}></span>
      {name}
    </button>
  )
}

export default CategoryTag