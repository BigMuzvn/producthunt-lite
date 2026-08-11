import { useState, useEffect } from 'react'
import { getPublicStats } from '../services/util.service'

function StatsSection() {
  const [statsData, setStatsData] = useState({
    productsCount: null,
    votesCount: null,
    membersCount: null
  })

  useEffect(() => {
    getPublicStats()
      .then(data => setStatsData(data))
      .catch(() => {})
  }, [])

  const items = [
    {
      id: 1,
      value: statsData.productsCount !== null ? `${statsData.productsCount}` : '—',
      label: 'Produits référencés'
    },
    {
      id: 2,
      value: statsData.votesCount !== null ? `${statsData.votesCount}` : '—',
      label: 'Votes de la communauté'
    },
    {
      id: 3,
      value: statsData.membersCount !== null ? `${statsData.membersCount}` : '—',
      label: 'Membres actifs'
    },
    {
      id: 4,
      value: '100%',
      label: 'Gratuit & Open Source'
    }
  ]

  return (
    <section id="stats" className="container">
      <div className="stats-grid">
        {items.map((stat) => (
          <div key={stat.id} className="stat-item">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatsSection