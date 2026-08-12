import { apiFetch } from './api';

export function getProducts(sort = 'votes') {
  return apiFetch(`/api/products?sort=${sort}`);
}

export function getProductById(id) {
  return apiFetch(`/api/products/${id}`);
}

export function createProduct(productData) {
  return apiFetch('/api/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(productData)
  });
}

export function voteProduct(id) {
  return apiFetch(`/api/products/${id}/vote`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function getMyProducts() {
  return apiFetch('/api/products/mine', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function getProductsByCategory(categoryId, sort = 'votes') {
  return apiFetch(`/api/products?categoryId=${categoryId}&sort=${sort}`);
}

export function updateProduct(id, data) {
  return apiFetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(data)
  });
}

export function deleteProduct(id) {
  return apiFetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function getMyVotes() {
  return apiFetch('/api/products/my-votes', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function unvoteProduct(id) {
  return apiFetch(`/api/products/${id}/vote`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function searchProducts(query, sort = 'votes') {
  return apiFetch(`/api/products?search=${encodeURIComponent(query)}&sort=${sort}`);
}