import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../services/auth.service'

export function useAuthGate() {
  const [promptOpen, setPromptOpen] = useState(false)
  const navigate = useNavigate()

  function requireAuth(action) {
    if (getToken()) {
      action()
    } else {
      setPromptOpen(true)
    }
  }

  function goToLogin() {
    setPromptOpen(false)
    navigate('/login')
  }

  return { promptOpen, requireAuth, goToLogin, closePrompt: () => setPromptOpen(false) }
}