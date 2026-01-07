export const environment = {
  production: true,
  apiUrl: (typeof import.meta !== 'undefined' && import.meta.env?.['VITE_API_BASE_URL']) || 'https://api-virtubuild.up.railway.app/api',
};
