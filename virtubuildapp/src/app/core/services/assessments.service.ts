import { httpClient } from '@/app/core/api';

export const AssessmentsService = {
  list: async () => {
    const res = await httpClient.get('/assessments');
    return res.data;
  },
  getByLabActivity: async (labActivityId: number) => {
    const res = await httpClient.get(`/assessments/lab-activity/${labActivityId}`);
    return res.data;
  },
  getById: async (id: number) => {
    const res = await httpClient.get(`/assessments/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await httpClient.post('/assessments', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await httpClient.put(`/assessments/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await httpClient.delete(`/assessments/${id}`);
    return res.data;
  },
};


