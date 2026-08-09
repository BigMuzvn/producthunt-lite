import { Navigate } from 'react-router-dom'
import { getUser, getToken } from '../services/auth.service'

export default function AdminRoute({ children }) {
  const token = getToken()
  const user = getUser()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!user?.isAdmin && !user?.isSuperAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}