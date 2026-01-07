import { httpClient } from '@/app/core/api';

export const StudentGroupsService = {
  list: async () => {
    const res = await httpClient.get('/student-groups');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await httpClient.get(`/student-groups/${id}`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await httpClient.post('/student-groups', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await httpClient.put(`/student-groups/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await httpClient.delete(`/student-groups/${id}`);
    return res.data;
  },
  assignStudent: async (groupId: number, studentId: number) => {
    const res = await httpClient.post(`/student-groups/${groupId}/students/${studentId}`);
    return res.data;
  },
  removeStudent: async (groupId: number, studentId: number) => {
    const res = await httpClient.delete(`/student-groups/${groupId}/students/${studentId}`);
    return res.data;
  },
  getStudents: async (groupId: number) => {
    const res = await httpClient.get(`/student-groups/${groupId}/students`);
    return res.data;
  },
  getStudentGroups: async (studentId: number) => {
    const res = await httpClient.get(`/student-groups/student/${studentId}`);
    return res.data;
  }
};
