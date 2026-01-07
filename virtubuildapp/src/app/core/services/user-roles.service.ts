import { httpClient } from '@/app/core/api';

export const UserRolesService = {
  list: async () => {
    const res = await httpClient.get('/user-roles');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await httpClient.get(`/user-roles/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await httpClient.post('/user-roles', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await httpClient.put(`/user-roles/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await httpClient.delete(`/user-roles/${id}`);
    return res.data;
  }
};
