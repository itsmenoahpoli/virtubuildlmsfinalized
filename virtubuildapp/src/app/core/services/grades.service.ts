import { httpClient } from '@/app/core/api';

export const GradesService = {
  listMine: async () => {
    const res = await httpClient.get('/grades/me');
    return res.data;
  },
  listForActivity: async (activityId: number) => {
    const res = await httpClient.get(`/grades/activity/${activityId}`);
    return res.data;
  },
};


