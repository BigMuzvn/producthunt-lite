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
    <div className="admin-tab-content">
      {/* Grille 2 Panneaux : Mon Profil & Créer un Administrateur */}
      <div className="admin-panels-grid">
        {/* Panneau 1 : Mon profil */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3 style={{ margin: 0 }}>Mon Profil Administrateur</h3>
            <span className="admin-panel-badge">{currentUser?.isSuperAdmin ? 'Super Admin' : 'Admin'}</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', display: 'block', marginBottom: 8 }}>
              Nom complet
            </label>
            <form onSubmit={handleNameSubmit} style={{ display: 'flex', gap: 10 }}>
              <input
                aria-label="Nom super admin"
                value={nameForm.name}
                onChange={e => setNameForm({ name: e.target.value })}
                required
                style={{ flex: 1, padding: '11px 14px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 10, color: '#FFFFFF' }}
              />
              <button type="submit" className="btn btn-secondary" style={{ flexShrink: 0, padding: '11px 16px', fontSize: 13 }}>
                Enregistrer
              </button>
            </form>
          </div>

          {/* Section Changement d'email */}
          <div style={{ padding: 16, background: 'rgba(255, 255, 255, 0.02)', borderRadius: 14, border: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 12 }}>
              Adresse Email actuelle : <strong style={{ color: '#FFFFFF' }}>{currentUser?.email}</strong>
            </span>

            {emailForm.step === 'idle' ? (
              <form onSubmit={handleRequestEmailOtp}>
                <div className="form-field" style={{ marginBottom: 12 }}>
                  <label htmlFor="admin-new-email">Nouvelle adresse email</label>
                  <input
                    id="admin-new-email"
                    type="email"
                    value={emailForm.newEmail}
                    onChange={e => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                    placeholder="nouvelle@adresse.com"
                    required
                  />
                </div>
                <div className="form-field" style={{ marginBottom: 14 }}>
                  <label htmlFor="admin-email-pwd">Mot de passe actuel pour valider</label>
                  <input
                    id="admin-email-pwd"
                    type="password"
                    value={emailForm.currentPassword}
                    onChange={e => setEmailForm({ ...emailForm, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '11px', fontSize: 13 }}>
                  Envoyer le code de confirmation
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmEmailChange}>
                <p className="admin-row-meta" style={{ marginBottom: 10, color: '#38BDF8' }}>Code de confirmation envoyé à {emailForm.newEmail}</p>
                <div className="form-field" style={{ marginBottom: 14 }}>
                  <label htmlFor="admin-email-otp">Saisir le code à 6 chiffres</label>
                  <input id="admin-email-otp" value={emailForm.otpCode} onChange={e => setEmailForm({ ...emailForm, otpCode: e.target.value })} required />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Confirmer l'email</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEmailForm({ newEmail: '', currentPassword: '', otpCode: '', step: 'idle' })}>Annuler</button>
                </div>
              </form>
            )}
          </div>

          {/* Section Changement de mot de passe */}
          <div style={{ padding: 16, background: 'rgba(255, 255, 255, 0.02)', borderRadius: 14, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#E2E8F0', display: 'block', marginBottom: 12 }}>
              Sécurité & Mot de passe
            </span>

            {passwordForm.step === 'idle' ? (
              <form onSubmit={handleRequestPasswordOtp}>
                <div className="form-field" style={{ marginBottom: 12 }}>
                  <label htmlFor="admin-pwd-current">Mot de passe actuel</label>
                  <input id="admin-pwd-current" type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
                </div>
                <div className="form-field" style={{ marginBottom: 14 }}>
                  <label htmlFor="admin-pwd-new">Nouveau mot de passe</label>
                  <input id="admin-pwd-new" type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
                  <PasswordRequirements password={passwordForm.newPassword} />
                </div>
                <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '11px', fontSize: 13 }}>
                  Changer le mot de passe
                </button>
              </form>
            ) : (
              <form onSubmit={handleConfirmPasswordChange}>
                <p className="admin-row-meta" style={{ marginBottom: 10, color: '#38BDF8' }}>Code de sécurité envoyé par email</p>
                <div className="form-field" style={{ marginBottom: 14 }}>
                  <label htmlFor="admin-pwd-otp">Code reçu</label>
                  <input id="admin-pwd-otp" value={passwordForm.otpCode} onChange={e => setPasswordForm({ ...passwordForm, otpCode: e.target.value })} required />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Valider le changement</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setPasswordForm({ currentPassword: '', newPassword: '', otpCode: '', step: 'idle' })}>Annuler</button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Panneau 2 : Ajouter un administrateur */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <h3 style={{ margin: 0 }}>Nouveau Membre Admin</h3>
            <span className="admin-panel-badge">Création</span>
          </div>

          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.55 }}>
            Invitez un nouvel administrateur à rejoindre l'équipe de gestion de la plateforme.
          </p>

          <form onSubmit={handleCreateAdminSubmit}>
            <div className="form-field">
              <label htmlFor="new-admin-name">Nom complet</label>
              <input id="new-admin-name" value={newAdminForm.name} onChange={e => setNewAdminForm({ ...newAdminForm, name: e.target.value })} placeholder="ex: Alexandre Martin" required />
            </div>

            <div className="form-field">
              <label htmlFor="new-admin-email">Adresse Email</label>
              <input id="new-admin-email" type="email" value={newAdminForm.email} onChange={e => setNewAdminForm({ ...newAdminForm, email: e.target.value })} placeholder="alexandre@startup.com" required />
            </div>

            <div className="form-field" style={{ marginBottom: 24 }}>
              <label htmlFor="new-admin-pwd">Mot de passe temporaire</label>
              <input id="new-admin-pwd" type="password" value={newAdminForm.password} onChange={e => setNewAdminForm({ ...newAdminForm, password: e.target.value })} required />
              <PasswordRequirements password={newAdminForm.password} />
            </div>

            <button type="submit" className="btn btn-primary btn-glow" style={{ width: '100%', padding: '14px', fontSize: 14.5 }}>
              + Créer le compte administrateur
            </button>
          </form>
        </div>
      </div>

      {adminMessage && <div className="settings-status" style={{ marginBottom: 24 }}>{adminMessage}</div>}
      {adminError && <div className="auth-error" style={{ marginBottom: 24 }}>{adminError}</div>}

      {/* Liste des administrateurs */}
      <div className="admin-section-header" style={{ margin: '32px 0 18px' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 20, color: '#FFFFFF' }}>
          Membres de l'équipe administrateur
        </h3>
        <span className="admin-count-badge">{(admins.length + (superAdmin ? 1 : 0))} Membres</span>
      </div>

      <div className="admin-table">
        {/* Carte du Super Admin */}
        {superAdmin && (
          <div className="admin-row" style={{ borderLeft: '4px solid #A855F7' }}>
            <div className="admin-user-avatar" style={{ background: 'linear-gradient(135deg, #A855F7, #6366F1)' }}>
              {superAdmin.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div className="admin-row-info">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <strong className="admin-row-title">{superAdmin.name}</strong>
                <span className="admin-badge admin-badge-super">Super Admin 🛡️</span>
              </div>
              <p className="admin-row-sub">{superAdmin.email}</p>
            </div>
            <span className="admin-row-meta">Fondateur & Accès Total</span>
          </div>
        )}

        {/* Liste des Administrateurs standard */}
        {admins.map(a => (
          <div key={a._id} className="admin-row">
            {editingAdminId === a._id ? (
              <form onSubmit={e => handleEditAdminSubmit(e, a._id)} className="admin-row-info" style={{ width: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 12 }}>
                  <div className="form-field" style={{ margin: 0 }}>
                    <label htmlFor={`edit-admin-name-${a._id}`}>Nom complet</label>
                    <input id={`edit-admin-name-${a._id}`} value={editAdminForm.name} onChange={e => setEditAdminForm({ ...editAdminForm, name: e.target.value })} required />
                  </div>
                  <div className="form-field" style={{ margin: 0 }}>
                    <label htmlFor={`edit-admin-email-${a._id}`}>Email</label>
                    <input id={`edit-admin-email-${a._id}`} type="email" value={editAdminForm.email} onChange={e => setEditAdminForm({ ...editAdminForm, email: e.target.value })} required />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>Enregistrer</button>
                  <button type="button" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => setEditingAdminId(null)}>Annuler</button>
                </div>
              </form>
            ) : resettingAdminId === a._id ? (
              <form onSubmit={e => handleResetAdminPasswordSubmit(e, a._id)} className="admin-row-info" style={{ width: '100%' }}>
                <div className="form-field" style={{ marginBottom: 12 }}>
                  <label htmlFor={`reset-pwd-${a._id}`}>Nouveau mot de passe pour {a.name}</label>
                  <input id={`reset-pwd-${a._id}`} type="password" value={resetAdminPassword} onChange={e => setResetAdminPassword(e.target.value)} required />
                  <PasswordRequirements password={resetAdminPassword} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>Valider le mot de passe</button>
                  <button type="button" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => setResettingAdminId(null)}>Annuler</button>
                </div>
              </form>
            ) : (
              <>
                <div className="admin-user-avatar" style={{ background: 'linear-gradient(135deg, #38BDF8, #0284C7)' }}>
                  {a.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>

                <div className="admin-row-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <strong className="admin-row-title">{a.name}</strong>
                    <span className="admin-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>Admin</span>
                  </div>
                  <p className="admin-row-sub">{a.email}</p>
                  <p className="admin-row-meta">Ajouté le {new Date(a.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>

                <div className="admin-row-actions">
                  <button className="btn btn-secondary" onClick={() => startEditingAdmin(a)} style={{ padding: '8px 12px', fontSize: 13 }}>
                    Modifier
                  </button>
                  <button className="btn btn-secondary" onClick={() => startResettingAdminPassword(a._id)} style={{ padding: '8px 12px', fontSize: 13 }}>
                    Réinit. Mdp
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleToggleAdmin(a._id)} style={{ padding: '8px 12px', fontSize: 13 }}>
                    Retirer Admin
                  </button>
                  <button className="dash-btn-delete" onClick={() => handleDeleteUser(a._id)} style={{ padding: '8px 12px', fontSize: 13 }}>
                    Supprimer
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {admins.length === 0 && (
          <div className="admin-empty">
            <p>Aucun autre administrateur pour l'instant.</p>
          </div>
        )}
      </div>
    </div>
  )
}
