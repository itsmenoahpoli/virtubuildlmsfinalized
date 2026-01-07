import { httpClient } from '@/app/core/api';

export const ActivationsService = {
  listByModule: async (moduleId: number) => {
    const res = await httpClient.get(`/activations/module/${moduleId}`);
    return res.data;
  },
  activate: async (moduleId: number, groupName: string) => {
    const res = await httpClient.post(`/activations/module/${moduleId}/groups/${groupName}`);
    return res.data;
  },
  deactivate: async (moduleId: number, groupName: string) => {
    const res = await httpClient.delete(`/activations/module/${moduleId}/groups/${groupName}`);
    return res.data;
  },
};


