function CategoryTag({ name, color }) {
  function handleClick() {
    console.log(`Filtrer par catégorie : ${name}`)
  }

  return (
    <button className="category-tag" onClick={handleClick}>
      <span className="category-dot" style={{ backgroundColor: color }}></span>
      {name}
    </button>
  )
}

export default CategoryTag