import { httpClient } from '@/app/core/api';

export const AdminService = {
  getDashboardStats: async () => {
    const res = await httpClient.get('/admin/dashboard/stats');
    return res.data;
  },
  getAllUsers: async () => {
    const res = await httpClient.get('/admin/users');
    return res.data;
  },
  getUserById: async (id: number) => {
    const res = await httpClient.get(`/admin/users/${id}`);
    return res.data;
  },
  createUser: async (data: any) => {
    const res = await httpClient.post('/admin/users', data);
    return res.data;
  },
  updateUser: async (id: number, data: any) => {
    const res = await httpClient.put(`/admin/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id: number) => {
    const res = await httpClient.delete(`/admin/users/${id}`);
    return res.data;
  },
  getAllUserRoles: async () => {
    const res = await httpClient.get('/admin/user-roles');
    return res.data;
  },
  getUserRoleById: async (id: number) => {
    const res = await httpClient.get(`/admin/user-roles/${id}`);
    return res.data;
  },
  createUserRole: async (data: any) => {
    const res = await httpClient.post('/admin/user-roles', data);
    return res.data;
  },
  updateUserRole: async (id: number, data: any) => {
    const res = await httpClient.put(`/admin/user-roles/${id}`, data);
    return res.data;
  },
  deleteUserRole: async (id: number) => {
    const res = await httpClient.delete(`/admin/user-roles/${id}`);
    return res.data;
  },
  getAllModules: async () => {
    const res = await httpClient.get('/admin/modules');
    return res.data;
  },
  getModuleById: async (id: number) => {
    const res = await httpClient.get(`/admin/modules/${id}`);
    return res.data;
  },
  createModule: async (data: any) => {
    const res = await httpClient.post('/admin/modules', data);
    return res.data;
  },
  updateModule: async (id: number, data: any) => {
    const res = await httpClient.put(`/admin/modules/${id}`, data);
    return res.data;
  },
  deleteModule: async (id: number) => {
    const res = await httpClient.delete(`/admin/modules/${id}`);
    return res.data;
  },
  getAllLabActivities: async () => {
    const res = await httpClient.get('/activities');
    return res.data;
  },
  getLabActivityById: async (id: number) => {
    const res = await httpClient.get(`/activities/${id}`);
    return res.data;
  },
  createLabActivity: async (data: any) => {
    const res = await httpClient.post('/activities', data);
    return res.data;
  },
  updateLabActivity: async (id: number, data: any) => {
    const res = await httpClient.put(`/activities/${id}`, data);
    return res.data;
  },
  deleteLabActivity: async (id: number) => {
    const res = await httpClient.delete(`/activities/${id}`);
    return res.data;
  },
  getAllAssessments: async () => {
    const res = await httpClient.get('/admin/assessments');
    return res.data;
  },
  getAssessmentById: async (id: number) => {
    const res = await httpClient.get(`/admin/assessments/${id}`);
    return res.data;
  },
  getAssessmentSubmissions: async (id: number) => {
    const res = await httpClient.get(`/admin/assessments/${id}/submissions`);
    return res.data;
  },
  createAssessment: async (data: any) => {
    const res = await httpClient.post('/admin/assessments', data);
    return res.data;
  },
  updateAssessment: async (id: number, data: any) => {
    const res = await httpClient.put(`/admin/assessments/${id}`, data);
    return res.data;
  },
  deleteAssessment: async (id: number) => {
    const res = await httpClient.delete(`/admin/assessments/${id}`);
    return res.data;
  },
  getAllGrades: async () => {
    const res = await httpClient.get('/admin/grades');
    return res.data;
  },
  getGradeById: async (id: number) => {
    const res = await httpClient.get(`/admin/grades/${id}`);
    return res.data;
  },
  createGrade: async (data: any) => {
    const res = await httpClient.post('/admin/grades', data);
    return res.data;
  },
  updateGrade: async (id: number, data: any) => {
    const res = await httpClient.put(`/admin/grades/${id}`, data);
    return res.data;
  },
  deleteGrade: async (id: number) => {
    const res = await httpClient.delete(`/admin/grades/${id}`);
    return res.data;
  },
  getAllPerformanceAnalytics: async () => {
    const res = await httpClient.get('/admin/performance-analytics');
    return res.data;
  },
  getPerformanceAnalyticsById: async (id: number) => {
    const res = await httpClient.get(`/admin/performance-analytics/${id}`);
    return res.data;
  },
  createPerformanceAnalytics: async (data: any) => {
    const res = await httpClient.post('/admin/performance-analytics', data);
    return res.data;
  },
  updatePerformanceAnalytics: async (id: number, data: any) => {
    const res = await httpClient.put(`/admin/performance-analytics/${id}`, data);
    return res.data;
  },
  deletePerformanceAnalytics: async (id: number) => {
    const res = await httpClient.delete(`/admin/performance-analytics/${id}`);
    return res.data;
  },
  getAllModuleActivations: async () => {
    const res = await httpClient.get('/admin/module-activations');
    return res.data;
  },
  getModuleActivationById: async (id: number) => {
    const res = await httpClient.get(`/admin/module-activations/${id}`);
    return res.data;
  },
  createModuleActivation: async (data: any) => {
    const res = await httpClient.post('/admin/module-activations', data);
    return res.data;
  },
  updateModuleActivation: async (id: number, data: any) => {
    const res = await httpClient.put(`/admin/module-activations/${id}`, data);
    return res.data;
  },
  deleteModuleActivation: async (id: number) => {
    const res = await httpClient.delete(`/admin/module-activations/${id}`);
    return res.data;
  }
};
