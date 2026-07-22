import { apiFetch } from './api';

export function getProducts() {
  return apiFetch('/products');
}

export function getProductById(id) {
  return apiFetch(`/products/${id}`);
}