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
    <div>
      <div className="admin-panel" style={{ marginBottom: 20 }}>
        <h3>Ajouter une catégorie</h3>
        <form onSubmit={handleCreateCategorySubmit} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-field" style={{ flex: 1, minWidth: 200 }}>
            <label htmlFor="admin-cat-name">Nom</label>
            <input
              id="admin-cat-name"
              value={newCategoryForm.name}
              onChange={e => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
              placeholder="ex: Productivité"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="admin-cat-color">Couleur</label>
            <input
              id="admin-cat-color"
              type="color"
              value={newCategoryForm.color}
              onChange={e => setNewCategoryForm({ ...newCategoryForm, color: e.target.value })}
              style={{ width: 48, height: 38, padding: 2 }}
            />
          </div>
          <button type="submit" className="btn btn-primary">+ Créer la catégorie</button>
        </form>
      </div>

      {adminMessage && <div className="settings-status" style={{ marginBottom: 16 }}>{adminMessage}</div>}
      {adminError && <div className="auth-error" style={{ marginBottom: 16 }}>{adminError}</div>}

      <div className="admin-table">
        {categories.map(c => (
          <div key={c._id} className="admin-row">
            <div className="admin-row-info">
              <span className="category-dot" style={{ background: c.color }} />
              <strong>{c.name}</strong>
            </div>
            <div className="admin-row-actions">
              <button className="btn btn-secondary" style={{ color: '#B3261E' }} onClick={() => handleDeleteCategory(c._id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="admin-empty">Aucune catégorie existante.</p>}
      </div>
    </div>
  )
}
