import { httpClient } from '@/app/core/api';

export const UsersService = {
  getMyProfile: async () => {
    const res = await httpClient.get('/users/me');
    return res.data;
  },
  updateMyProfile: async (data: any) => {
    const res = await httpClient.put('/users/me', data);
    return res.data;
  },
  getAllUsers: async () => {
    const res = await httpClient.get('/users');
    return res.data;
  },
  getUserById: async (id: number) => {
    const res = await httpClient.get(`/users/${id}`);
    return res.data;
  },
  createUser: async (data: any) => {
    const res = await httpClient.post('/users', data);
    return res.data;
  },
  updateUser: async (id: number, data: any) => {
    const res = await httpClient.put(`/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id: number) => {
    const res = await httpClient.delete(`/users/${id}`);
    return res.data;
  }
};
