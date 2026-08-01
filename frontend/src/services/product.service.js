import { apiFetch } from './api';

export function getProducts() {
  return apiFetch('/products');
}

export function getProductById(id) {
  return apiFetch(`/products/${id}`);
}


export function createProduct(productData) {
  return apiFetch('/products', {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(productData)
  });
}

export function voteProduct(id) {
  return apiFetch(`/products/${id}/vote`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function getMyProducts() {
  return apiFetch('/products/mine', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function getProductsByCategory(categoryId) {
  return apiFetch(`/products?categoryId=${categoryId}`);
}

export function updateProduct(id, data) {
  return apiFetch(`/products/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(data)
  });
}

export function deleteProduct(id) {
  return apiFetch(`/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function getMyVotes() {
  return apiFetch('/products/my-votes', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}


export function unvoteProduct(id) {
  return apiFetch(`/products/${id}/vote`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}

export function searchProducts(query) {
  return apiFetch(`/products?search=${encodeURIComponent(query)}`);
}