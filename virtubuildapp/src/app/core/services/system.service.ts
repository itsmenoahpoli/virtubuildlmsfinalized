import { httpClient } from '@/app/core/api';

export const SystemService = {
  healthCheck: async () => {
    const res = await httpClient.get('/system/healthcheck');
    return res.data;
  },
  getSystemInfo: async () => {
    const res = await httpClient.get('/system/info');
    return res.data;
  }
};
