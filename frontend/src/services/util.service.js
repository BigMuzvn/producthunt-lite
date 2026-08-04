import { apiFetch } from './api';

export function validateEmail(email) {
  return apiFetch(`/utils/validate-email?email=${encodeURIComponent(email)}`);
}