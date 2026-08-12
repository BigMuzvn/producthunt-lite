import { apiFetch } from './api';

export function getNotifications() {
  return apiFetch('/notifications', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function markNotificationsRead() {
  return apiFetch('/notifications/read-all', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}
