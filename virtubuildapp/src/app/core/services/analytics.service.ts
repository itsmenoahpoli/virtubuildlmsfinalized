import { httpClient } from '@/app/core/api';

export const AnalyticsService = {
  getMine: async () => {
    const res = await httpClient.get('/analytics/me');
    return res.data;
  },
};


