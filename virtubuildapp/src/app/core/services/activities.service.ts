import { httpClient } from '@/app/core/api';

export const ActivitiesService = {
  list: async () => {
    const res = await httpClient.get('/activities');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await httpClient.get(`/activities/${id}`);
    return res.data;
  },
};


