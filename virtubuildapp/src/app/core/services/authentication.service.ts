import { httpClient } from '@/app/core/api';
import { Router } from '@angular/router';

const decodeJwt = (token: string): any => {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
  try {
    return JSON.parse(decodeURIComponent(escape(payload)));
  } catch {
    return JSON.parse(payload);
  }
};

export const AuthenticationService = {
  signin: async (
    email: string,
    password: string
  ) => {
    const response = await httpClient.post('/auth/signin', {
      email,
      password,
    });
    const token = response.data?.authToken;
    const userData = response.data?.user;
    
    if (token) {
      localStorage.setItem('authToken', token);
    }
    
    const decoded = token ? decodeJwt(token) : null;
    
    return {
      ...decoded,
      user: userData || decoded?.user
    };
  },
  signout: () => {
    localStorage.removeItem('authToken');
  },
  getToken: () => localStorage.getItem('authToken'),
  getRole: (): string | null => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    const decoded = decodeJwt(token);
    const role = decoded?.user?.roleName || decoded?.user?.role || null;
    return role;
  },
  requestPasswordReset: async (email: string) => {
    const res = await httpClient.post('/auth/request-password-reset', { email });
    return res.data;
  },
  resetPassword: async (token: string, newPassword: string) => {
    const res = await httpClient.post('/auth/reset-password', { token, newPassword });
    return res.data;
  },
};
