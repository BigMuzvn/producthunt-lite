import { apiFetch } from './api';

export function getCategories() {
  return apiFetch('/categories');
}