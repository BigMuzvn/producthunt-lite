import { apiFetch } from './api';

export function uploadImage(base64Data) {
  return apiFetch('/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({ image: base64Data })
  });
}

export function getImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('/uploads')) {
    return `http://localhost:5000${url}`;
  }
  return url;
}
