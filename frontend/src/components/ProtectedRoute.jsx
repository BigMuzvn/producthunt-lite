import { Navigate } from 'react-router-dom'
import { getToken, getUser } from '../services/auth.service'

export default function ProtectedRoute({ children }) {
  const token = getToken()
  const user = getUser()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (user?.isAdmin || user?.isSuperAdmin) {
    return <Navigate to="/admin" replace />
  }

  return children
}