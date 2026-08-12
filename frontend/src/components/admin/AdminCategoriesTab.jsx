export default function AdminCategoriesTab({
  categories,
  newCategoryForm,
  setNewCategoryForm,
  handleCreateCategorySubmit,
  handleDeleteCategory,
  adminMessage,
  adminError
}) {
  return (
    <div className="admin-tab-content">
      {/* Formulaire de création de catégorie */}
      <div className="admin-panel" style={{ marginBottom: 28 }}>
        <div className="admin-panel-header" style={{ marginBottom: 20, paddingBottom: 0, borderBottom: 'none' }}>
          <div>
            <h3 style={{ margin: 0 }}>Ajouter une nouvelle catégorie</h3>
            <p style={{ margin: '4px 0 0', fontSize: 13.5, color: 'var(--text-secondary)' }}>
              Créez des thématiques pour organiser les lancements sur la plateforme.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateCategorySubmit} style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-field" style={{ flex: 1, minWidth: 240, margin: 0 }}>
            <label htmlFor="admin-cat-name">Nom de la catégorie</label>
            <input
              id="admin-cat-name"
              value={newCategoryForm.name}
              onChange={e => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
              placeholder="ex: Intelligence Artificielle, Éducation..."
              required
            />
          </div>

          <div className="form-field" style={{ width: 100, flexShrink: 0, margin: 0 }}>
            <label htmlFor="admin-cat-color">Couleur</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                id="admin-cat-color"
                type="color"
                value={newCategoryForm.color}
                onChange={e => setNewCategoryForm({ ...newCategoryForm, color: e.target.value })}
                style={{ width: 44, height: 42, padding: 3, cursor: 'pointer', borderRadius: 10 }}
              />
              <span style={{ fontSize: 12, fontWeight: 700, color: newCategoryForm.color, fontFamily: 'monospace' }}>
                {newCategoryForm.color}
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-glow" style={{ padding: '13px 20px', fontSize: 14.5 }}>
            + Créer la catégorie
          </button>
        </form>
      </div>

      {adminMessage && <div className="settings-status" style={{ marginBottom: 20 }}>{adminMessage}</div>}
      {adminError && <div className="auth-error" style={{ marginBottom: 20 }}>{error}</div>}

      {/* Grille des catégories existantes */}
      <div className="admin-categories-grid">
        {categories.map(c => (
          <div key={c._id} className="admin-category-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
              <span className="category-dot" style={{ background: c.color || '#38BDF8', width: 12, height: 12, boxShadow: `0 0 10px ${c.color || '#38BDF8'}` }} />
              <strong style={{ fontSize: 15, color: '#FFFFFF', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {c.name}
              </strong>
            </div>

            <button
              className="dash-btn-delete"
              onClick={() => handleDeleteCategory(c._id)}
              title="Supprimer la catégorie"
              style={{ padding: '6px 12px', fontSize: 12.5 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span>Supprimer</span>
            </button>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="admin-empty" style={{ gridColumn: '1 / -1' }}>
            <p>Aucune catégorie créée pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
