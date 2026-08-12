import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProductComments, addComment, deleteComment } from '../services/comment.service'
import { getUser, getToken } from '../services/auth.service'
import { getImageUrl } from '../services/upload.service'
import { useAuthGate } from '../hooks/useAuthGate'
import AuthPromptModal from './AuthPromptModal'

export default function ProductComments({ productId, productMakerId }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
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

  async function handlePublishComment(parentId = null) {
    const text = parentId ? replyText : newComment
    if (!text.trim()) return

    setSubmitting(true)
    setError('')
    try {
      const created = await addComment(productId, text.trim(), parentId)
      setComments([...comments, created])
      if (parentId) {
        setReplyText('')
        setReplyingTo(null)
      } else {
        setNewComment('')
      }
    } catch (err) {
      setError(err.message || 'Impossible de publier le commentaire.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    requireAuth(() => handlePublishComment(null))
  }

  function handleReplySubmit(e, parentId) {
    e.preventDefault()
    requireAuth(() => handlePublishComment(parentId))
  }

  async function handleDelete(commentId) {
    if (!window.confirm('Supprimer ce commentaire ?')) return
    try {
      await deleteComment(commentId)
      setComments(comments.filter(c => c._id !== commentId && c.parentId !== commentId))
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression')
    }
  }

  const rootComments = comments.filter(c => !c.parentId)
  const getReplies = (parentId) => comments.filter(c => c.parentId === parentId)

  return (
    <section id="comments" className="product-comments-section" aria-labelledby="comments-heading">
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
          <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--cyan)' }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h4 style={{ margin: '0 0 6px', fontSize: 16, color: '#FFFFFF' }}>Aucun avis pour l'instant</h4>
          <p style={{ margin: 0, fontSize: 13 }}>Soyez le premier à poser une question ou partager votre retour d'expérience !</p>
        </div>
      )}

      <div className="comments-list">
        {rootComments.map(c => {
          const authorId = c.userId?._id || c.userId
          const isAuthor = currentUser && (currentUser._id === authorId || currentUser.id === authorId)
          const isAdmin = currentUser && (currentUser.isAdmin || currentUser.isSuperAdmin)
          const isMaker = productMakerId && authorId && productMakerId.toString() === authorId.toString()
          const replies = getReplies(c._id)

          return (
            <div key={c._id} className="comment-item-group">
              <div className="comment-item">
                <div className="comment-item-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="comment-avatar">
                      {c.userId?.avatarUrl ? (
                        <img src={getImageUrl(c.userId.avatarUrl)} alt={c.userId.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        (c.userId?.name || 'M')[0].toUpperCase()
                      )}
                    </div>
                    <div>
                      {authorId ? (
                        <Link to={`/maker/${authorId}`} className="comment-author-name maker-link">
                          {c.userId?.name || 'Membre'}
                        </Link>
                      ) : (
                        <span className="comment-author-name">{c.userId?.name || 'Membre'}</span>
                      )}
                      {isMaker && (
                        <span className="comment-maker-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          Créateur
                        </span>
                      )}
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

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      type="button"
                      className="comment-reply-btn"
                      onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)}
                    >
                      Répondre
                    </button>

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
                </div>

                <p className="comment-content">{c.content}</p>
              </div>

              {/* Formulaire de réponse en fil de discussion */}
              {replyingTo === c._id && (
                <form onSubmit={(e) => handleReplySubmit(e, c._id)} className="comment-reply-form">
                  <textarea
                    rows="2"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={`Répondre à ${c.userId?.name || 'ce commentaire'}...`}
                    maxLength={1000}
                    required
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => setReplyingTo(null)}>
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: 12 }} disabled={submitting || !replyText.trim()}>
                      Envoyer la réponse
                    </button>
                  </div>
                </form>
              )}

              {/* Liste des réponses imbriquées */}
              {replies.length > 0 && (
                <div className="comment-replies-list">
                  {replies.map(reply => {
                    const rAuthorId = reply.userId?._id || reply.userId
                    const rIsAuthor = currentUser && (currentUser._id === rAuthorId || currentUser.id === rAuthorId)
                    const rIsAdmin = currentUser && (currentUser.isAdmin || currentUser.isSuperAdmin)
                    const rIsMaker = productMakerId && rAuthorId && productMakerId.toString() === rAuthorId.toString()

                    return (
                      <div key={reply._id} className="comment-item comment-reply-item">
                        <div className="comment-item-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="comment-avatar reply-avatar">
                              {(reply.userId?.name || 'M')[0].toUpperCase()}
                            </div>
                            <div>
                              {rAuthorId ? (
                                <Link to={`/maker/${rAuthorId}`} className="comment-author-name maker-link">
                                  {reply.userId?.name || 'Membre'}
                                </Link>
                              ) : (
                                <span className="comment-author-name">{reply.userId?.name || 'Membre'}</span>
                              )}
                              {rIsMaker && (
                                <span className="comment-maker-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                  Créateur
                                </span>
                              )}
                              <span className="comment-date">
                                {new Date(reply.createdAt).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>

                          {(rIsAuthor || rIsAdmin) && (
                            <button
                              type="button"
                              className="comment-delete-btn"
                              onClick={() => handleDelete(reply._id)}
                              title="Supprimer la réponse"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <p className="comment-content">{reply.content}</p>
                      </div>
                    )
                  })}
                </div>
              )}
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
