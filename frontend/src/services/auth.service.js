import { apiFetch } from './api';

export function register(name, email, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
}

export function login(email, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function saveAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem('token');
}

export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function verifyOtp(email, otpCode) {
  return apiFetch('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otpCode })
  });
}

export function resendOtp(email) {
  return apiFetch('/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export function forgotPassword(email) {
  return apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export function resetPassword(email, otpCode, newPassword) {
  return apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otpCode, newPassword })
  });
}

export function changePassword(currentPassword, newPassword) {
  return apiFetch('/auth/change-password', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({ currentPassword, newPassword })
  });
}

export function changeEmail(newEmail, currentPassword) {
  return apiFetch('/auth/change-email', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({ newEmail, currentPassword })
  });
}

export function deleteAccount(currentPassword) {
  return apiFetch('/auth/delete-account', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({ currentPassword })
  });
}