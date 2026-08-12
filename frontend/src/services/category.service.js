import { apiFetch } from './api';

export function getCategories() {
  return apiFetch('/api/categories');
}

export function createCategory(name, color) {
  return apiFetch('/api/categories', {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({ name, color })
  });
}