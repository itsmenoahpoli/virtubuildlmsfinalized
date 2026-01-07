import { httpClient } from '@/app/core/api';

export const StudentProgressService = {
  getMyProgress: async () => {
    const res = await httpClient.get('/student-progress/me');
    return res.data;
  },
  getAssignedActivities: async () => {
    const res = await httpClient.get('/student-progress/assigned-activities');
    return res.data;
  },
  getAssignedModules: async () => {
    const res = await httpClient.get('/student-progress/assigned-modules');
    return res.data;
  },
  submitProgress: async (data: any) => {
    const res = await httpClient.post('/student-progress/submit', data);
    return res.data;
  },
  getProgressByActivity: async (activityId: number) => {
    const res = await httpClient.get(`/student-progress/activity/${activityId}`);
    return res.data;
  },
  getInstructorOverview: async () => {
    const res = await httpClient.get('/student-progress/instructor/overview');
    return res.data;
  },
  getCompletionStats: async () => {
    const res = await httpClient.get('/student-progress/stats/me');
    return res.data;
  }
};
