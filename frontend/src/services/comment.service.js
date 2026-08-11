import { apiFetch } from './api';

export function getProductComments(productId) {
  return apiFetch(`/comments/product/${productId}`);
}

export function addComment(productId, content) {
  return apiFetch(`/comments/product/${productId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ content })
  });
}

export function deleteComment(commentId) {
  return apiFetch(`/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
}
