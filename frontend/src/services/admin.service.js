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