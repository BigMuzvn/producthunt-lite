import PasswordRequirements from '../PasswordRequirements'

export default function AdminTeamTab({
  currentUser,
  users,
  nameForm,
  setNameForm,
  handleNameSubmit,
  emailForm,
  setEmailForm,
  handleRequestEmailOtp,
  handleConfirmEmailChange,
  passwordForm,
  setPasswordForm,
  handleRequestPasswordOtp,
  handleConfirmPasswordChange,
  newAdminForm,
  setNewAdminForm,
  handleCreateAdminSubmit,
  editingAdminId,
  setEditingAdminId,
  editAdminForm,
  setEditAdminForm,
  handleEditAdminSubmit,
  startEditingAdmin,
  resettingAdminId,
  setResettingAdminId,
  resetAdminPassword,
  setResetAdminPassword,
  handleResetAdminPasswordSubmit,
  startResettingAdminPassword,
  handleToggleAdmin,
  handleDeleteUser,
  adminMessage,
  adminError
}) {
  const superAdmin = users.find(u => u.isSuperAdmin)
  const admins = users.filter(u => u.isAdmin && !u.isSuperAdmin)

  return (
    <div>
      <div className="admin-panels-grid">
        <div className="admin-panel">
          <h3>Mon profil</h3>

          <h4 style={{ fontSize: 13, marginTop: 4, marginBottom: 8, color: '#9A94B8' }}>Nom</h4>
          <form onSubmit={handleNameSubmit}>
            <div className="form-field">
              <input aria-label="Nom super admin" value={nameForm.name} onChange={e => setNameForm({ name: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-secondary">Enregistrer le nom</button>
          </form>

          <h4 style={{ fontSize: 13, marginTop: 24, marginBottom: 8, color: '#9A94B8' }}>Email actuel : {currentUser?.email}</h4>
          {emailForm.step === 'idle' ? (
            <form onSubmit={handleRequestEmailOtp}>
              <div className="form-field">
                <label htmlFor="admin-new-email">Nouvel email</label>
                <input id="admin-new-email" type="email" value={emailForm.newEmail} onChange={e => setEmailForm({ ...emailForm, newEmail: e.target.value })} required />
              </div>
              <div className="form-field">
                <label htmlFor="admin-email-pwd">Mot de passe actuel</label>
                <input id="admin-email-pwd" type="password" value={emailForm.currentPassword} onChange={e => setEmailForm({ ...emailForm, currentPassword: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-secondary">Envoyer le code de confirmation</button>
            </form>
          ) : (
            <form onSubmit={handleConfirmEmailChange}>
              <p className="admin-row-meta">Code envoyé à {emailForm.newEmail}</p>
              <div className="form-field">
                <label htmlFor="admin-email-otp">Code reçu</label>
                <input id="admin-email-otp" value={emailForm.otpCode} onChange={e => setEmailForm({ ...emailForm, otpCode: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary">Confirmer le nouvel email</button>
              <button type="button" className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => setEmailForm({ newEmail: '', currentPassword: '', otpCode: '', step: 'idle' })}>Annuler</button>
            </form>
          )}

          <h4 style={{ fontSize: 13, marginTop: 24, marginBottom: 8, color: '#9A94B8' }}>Mot de passe</h4>
          {passwordForm.step === 'idle' ? (
            <form onSubmit={handleRequestPasswordOtp}>
              <div className="form-field">
                <label htmlFor="admin-pwd-current">Mot de passe actuel</label>
                <input id="admin-pwd-current" type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
              </div>
              <div className="form-field">
                <label htmlFor="admin-pwd-new">Nouveau mot de passe</label>
                <input id="admin-pwd-new" type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
                <PasswordRequirements password={passwordForm.newPassword} />
              </div>
              <button type="submit" className="btn btn-secondary">Envoyer le code de confirmation</button>
            </form>
          ) : (
            <form onSubmit={handleConfirmPasswordChange}>
              <p className="admin-row-meta">Code envoyé à ton adresse actuelle</p>
              <div className="form-field">
                <label htmlFor="admin-pwd-otp">Code reçu</label>
                <input id="admin-pwd-otp" value={passwordForm.otpCode} onChange={e => setPasswordForm({ ...passwordForm, otpCode: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary">Confirmer le nouveau mot de passe</button>
              <button type="button" className="btn btn-secondary" style={{ marginLeft: 8 }} onClick={() => setPasswordForm({ currentPassword: '', newPassword: '', otpCode: '', step: 'idle' })}>Annuler</button>
            </form>
          )}
        </div>

        <div className="admin-panel">
          <h3>Ajouter un administrateur</h3>
          <form onSubmit={handleCreateAdminSubmit}>
            <div className="form-field">
              <label htmlFor="new-admin-name">Nom</label>
              <input id="new-admin-name" value={newAdminForm.name} onChange={e => setNewAdminForm({ ...newAdminForm, name: e.target.value })} placeholder="ex: Jean Dupont" required />
            </div>
            <div className="form-field">
              <label htmlFor="new-admin-email">Email</label>
              <input id="new-admin-email" type="email" value={newAdminForm.email} onChange={e => setNewAdminForm({ ...newAdminForm, email: e.target.value })} placeholder="jean.dupont@example.com" required />
            </div>
            <div className="form-field">
              <label htmlFor="new-admin-pwd">Mot de passe temporaire</label>
              <input id="new-admin-pwd" type="password" value={newAdminForm.password} onChange={e => setNewAdminForm({ ...newAdminForm, password: e.target.value })} required />
              <PasswordRequirements password={newAdminForm.password} />
            </div>
            <button type="submit" className="btn btn-primary">+ Créer le compte admin</button>
          </form>
        </div>
      </div>

      {adminMessage && <div className="settings-status" style={{ marginTop: 16 }}>{adminMessage}</div>}
      {adminError && <div className="auth-error" style={{ marginTop: 16 }}>{adminError}</div>}

      <h3 className="admin-section-title-plain">Membres de l'équipe administrateur</h3>
      <div className="admin-table">
        {superAdmin && (
          <div className="admin-row">
            <div className="admin-row-info">
              <strong>{superAdmin.name}</strong>
              <p>{superAdmin.email}</p>
            </div>
            <span className="admin-badge admin-badge-super">Super Admin</span>
          </div>
        )}
        {admins.map(a => (
          <div key={a._id} className="admin-row">
            {editingAdminId === a._id ? (
              <form onSubmit={e => handleEditAdminSubmit(e, a._id)} className="admin-row-info" style={{ flex: 1 }}>
                <div className="form-field">
                  <label htmlFor={`edit-admin-name-${a._id}`}>Nom</label>
                  <input id={`edit-admin-name-${a._id}`} value={editAdminForm.name} onChange={e => setEditAdminForm({ ...editAdminForm, name: e.target.value })} required />
                </div>
                <div className="form-field">
                  <label htmlFor={`edit-admin-email-${a._id}`}>Email</label>
                  <input id={`edit-admin-email-${a._id}`} type="email" value={editAdminForm.email} onChange={e => setEditAdminForm({ ...editAdminForm, email: e.target.value })} required />
                </div>
                <div className="admin-row-actions">
                  <button type="submit" className="btn btn-primary">Enregistrer</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditingAdminId(null)}>Annuler</button>
                </div>
              </form>
            ) : resettingAdminId === a._id ? (
              <form onSubmit={e => handleResetAdminPasswordSubmit(e, a._id)} className="admin-row-info" style={{ flex: 1 }}>
                <div className="form-field">
                  <label htmlFor={`reset-pwd-${a._id}`}>Nouveau mot de passe pour {a.name}</label>
                  <input id={`reset-pwd-${a._id}`} type="password" value={resetAdminPassword} onChange={e => setResetAdminPassword(e.target.value)} required />
                  <PasswordRequirements password={resetAdminPassword} />
                </div>
                <div className="admin-row-actions">
                  <button type="submit" className="btn btn-primary">Réinitialiser</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setResettingAdminId(null)}>Annuler</button>
                </div>
              </form>
            ) : (
              <>
                <div className="admin-row-info">
                  <strong>{a.name}</strong>
                  <p>{a.email}</p>
                  <p className="admin-row-meta">Créé le {new Date(a.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className="admin-badge">Admin</span>
                <div className="admin-row-actions">
                  <button className="btn btn-secondary" onClick={() => startEditingAdmin(a)}>Modifier</button>
                  <button className="btn btn-secondary" onClick={() => startResettingAdminPassword(a._id)}>Réinit. mdp</button>
                  <button className="btn btn-secondary" onClick={() => handleToggleAdmin(a._id)}>Retirer</button>
                  <button className="btn btn-secondary" style={{ color: '#B3261E' }} onClick={() => handleDeleteUser(a._id)}>Supprimer</button>
                </div>
              </>
            )}
          </div>
        ))}
        {admins.length === 0 && <p className="admin-empty">Aucun admin pour l'instant.</p>}
      </div>
    </div>
  )
}
