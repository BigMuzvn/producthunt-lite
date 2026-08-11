import { useState, useEffect } from 'react'
import { getProductComments, addComment, deleteComment } from '../services/comment.service'
import { getUser, getToken } from '../services/auth.service'
import { useAuthGate } from '../hooks/useAuthGate'
import AuthPromptModal from './AuthPromptModal'

export default function ProductComments({ productId, productMakerId }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const currentUser = getUser()
  const token = getToken()
  const { promptOpen, requireAuth, goToLogin, closePrompt } = useAuthGate()

  useEffect(() => {
    async function loadComments() {
      try {
        const data = await getProductComments(productId)
        setComments(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Erreur chargement commentaires:', err)
      } finally {
        setLoading(false)
      }
    }
    loadComments()
  }, [productId])

  async function handlePublishComment() {
    if (!newComment.trim()) return

    setSubmitting(true)
    setError('')
    try {
      const created = await addComment(productId, newComment.trim())
      setComments([created, ...comments])
      setNewComment('')
    } catch (err) {
      setError(err.message || 'Impossible de publier le commentaire.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    requireAuth(handlePublishComment)
  }

  async function handleDelete(commentId) {
    if (!window.confirm('Supprimer ce commentaire ?')) return
    try {
      await deleteComment(commentId)
      setComments(comments.filter(c => c._id !== commentId))
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression')
    }
  }

  return (
    <section className="product-comments-section" aria-labelledby="comments-heading">
      <div className="comments-header">
        <h3 id="comments-heading" style={{ fontSize: 20, margin: 0, fontFamily: 'var(--font-display)' }}>
          Avis et discussions ({comments.length})
        </h3>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Échangez avec le créateur et la communauté
        </span>
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <div className="comment-input-wrapper">
          <textarea
            id="comment-textarea"
            rows="3"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onFocus={() => {
              if (!token) requireAuth(() => {})
            }}
            placeholder="Une question, un retour constructif ou un mot d'encouragement..."
            maxLength={1000}
            required
            aria-label="Votre commentaire"
          />
          <div className="comment-form-footer">
            <span className="comment-char-counter">
              {newComment.length} / 1000
            </span>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? 'Publication...' : 'Publier mon avis'}
            </button>
          </div>
        </div>
        {error && <div className="auth-error" style={{ marginTop: 8 }}>{error}</div>}
      </form>

      {loading && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Chargement des avis...</p>}

      {!loading && comments.length === 0 && (
        <div className="empty-state" style={{ padding: '32px 16px', marginTop: 16 }}>
          <div className="empty-state-icon">💬</div>
          <h4 style={{ margin: '0 0 6px', fontSize: 16 }}>Aucun avis pour l'instant</h4>
          <p style={{ margin: 0, fontSize: 13 }}>Soyez le premier à poser une question ou partager votre retour d'expérience !</p>
        </div>
      )}

      <div className="comments-list">
        {comments.map(c => {
          const authorId = c.userId?._id || c.userId
          const isAuthor = currentUser && (currentUser._id === authorId || currentUser.id === authorId)
          const isAdmin = currentUser && (currentUser.isAdmin || currentUser.isSuperAdmin)
          const isMaker = productMakerId && authorId && productMakerId.toString() === authorId.toString()

          return (
            <div key={c._id} className="comment-item">
              <div className="comment-item-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="comment-avatar">
                    {(c.userId?.name || 'M')[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="comment-author-name">{c.userId?.name || 'Membre'}</span>
                    {isMaker && <span className="comment-maker-badge">Créateur</span>}
                    <span className="comment-date">
                      {new Date(c.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                {(isAuthor || isAdmin) && (
                  <button
                    type="button"
                    className="comment-delete-btn"
                    onClick={() => handleDelete(c._id)}
                    title="Supprimer ce commentaire"
                    aria-label="Supprimer le commentaire"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="comment-content">{c.content}</p>
            </div>
          )
        })}
      </div>

      {promptOpen && (
        <AuthPromptModal
          message="Connecte-toi pour donner ton avis et échanger avec le créateur."
          onLogin={goToLogin}
          onClose={closePrompt}
        />
      )}
    </section>
  )
}
