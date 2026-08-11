import { apiFetch } from './api';

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}` };
}

export function getStats() {
  return apiFetch('/admin/stats', { headers: authHeaders() });
}

export function getAllUsers() {
  return apiFetch('/admin/users', { headers: authHeaders() });
}

export function deleteUser(id) {
  return apiFetch(`/admin/users/${id}`, { method: 'DELETE', headers: authHeaders() });
}

export function toggleAdmin(id) {
  return apiFetch(`/admin/users/${id}/toggle-admin`, { method: 'PUT', headers: authHeaders() });
}

export function adminDeleteProduct(id) {
  return apiFetch(`/admin/products/${id}`, { method: 'DELETE', headers: authHeaders() });
}

export function adminDeleteCategory(id) {
  return apiFetch(`/admin/categories/${id}`, { method: 'DELETE', headers: authHeaders() });
}

export function createAdmin(name, email, password) {
  return apiFetch('/admin/create-admin', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, email, password })
  });
}

// ─── Profil de l'admin connecté ─────────────────────────────────────────

export function updateOwnName(name) {
  return apiFetch('/admin/profile/name', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ name })
  });
}

export function requestEmailChangeOtp(newEmail, currentPassword) {
  return apiFetch('/admin/profile/email/request-otp', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ newEmail, currentPassword })
  });
}

export function confirmEmailChange(otpCode) {
  return apiFetch('/admin/profile/email/confirm', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ otpCode })
  });
}

export function requestPasswordChangeOtp(currentPassword, newPassword) {
  return apiFetch('/admin/profile/password/request-otp', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword })
  });
}

export function confirmPasswordChange(otpCode) {
  return apiFetch('/admin/profile/password/confirm', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ otpCode })
  });
}

// ─── Gestion des autres admins (super admin) ────────────────────────────

export function updateOtherAdmin(id, data) {
  return apiFetch(`/admin/admins/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
}

export function resetOtherAdminPassword(id, newPassword) {
  return apiFetch(`/admin/admins/${id}/password`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ newPassword })
  });
}