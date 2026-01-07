import { httpClient } from '@/app/core/api';

export const ModulesService = {
  list: async () => {
    const res = await httpClient.get('/modules');
    return res.data;
  },
};


