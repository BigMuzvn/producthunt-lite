import { useNavigate } from 'react-router-dom'

function ProductCard({ _id, name, tagline, logoUrl, votesCount }) {
  const navigate = useNavigate()

  function handleCardClick() {
    navigate(`/products/${_id}`)
  }

  function handleVoteClick(event) {
    event.stopPropagation()
    console.log(`Vote enregistré pour : ${name}`)
  }

  return (
    <article className="product-card">
      <div className="product-body" onClick={handleCardClick}>
        <img src={logoUrl} alt={name} className="product-logo" />
        <div className="product-info">
          <h3>{name}</h3>
          <p>{tagline}</p>
        </div>
      </div>
      <button className="votes-badge" onClick={handleVoteClick}>
        <span>▲</span>
        <span>{votesCount}</span>
      </button>
    </article>
  )
}

export default ProductCard