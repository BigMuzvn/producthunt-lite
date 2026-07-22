import { getUser, logout } from '../services/auth.service'
import { useNavigate } from 'react-router-dom'
import './DashboardPage.css'

export default function DashboardPage() {
  const user = getUser()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <p className="dashboard-eyebrow">Espace membre</p>
        <h1 className="dashboard-heading">
          Bienvenue{user ? `, ${user.name}` : ''} 👋
        </h1>
        <p className="dashboard-subtext">
          Ceci est ton dashboard. Bientôt, tu y retrouveras tes produits publiés,
          tes votes, et tes statistiques.
        </p>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    </div>
  )
}