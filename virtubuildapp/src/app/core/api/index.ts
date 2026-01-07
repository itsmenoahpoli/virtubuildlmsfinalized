import axios, { AxiosInstance } from 'axios';
import { environment } from '@/environments/environment';

const DEFAULT_TIMEOUT_MS: number = 10000;

export const createHttpClient = (): AxiosInstance => {
  const viteEnv = (import.meta as any).env || {};
  const baseURL: string = viteEnv.VITE_APP_API_BASE_URL || environment.apiUrl;
  const timeoutEnv = viteEnv.VITE_APP_API_TIMEOUT_MS || DEFAULT_TIMEOUT_MS;
  const parsedTimeout = typeof timeoutEnv === 'string' ? parseInt(timeoutEnv, 10) : timeoutEnv;
  const timeout = Number.isFinite(parsedTimeout) ? parsedTimeout : DEFAULT_TIMEOUT_MS;
  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  return client;
};

export const httpClient = createHttpClient();
