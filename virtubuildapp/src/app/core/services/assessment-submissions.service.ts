import { httpClient } from '@/app/core/api';

export const AssessmentSubmissionsService = {
  submit: async (data: any) => {
    const res = await httpClient.post('/assessment-submissions/submit', data);
    return res.data;
  },
  getMySubmissions: async () => {
    const res = await httpClient.get('/assessment-submissions/me');
    return res.data;
  },
  getMyHistory: async () => {
    const res = await httpClient.get('/assessment-submissions/history/me');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await httpClient.get(`/assessment-submissions/${id}`);
    return res.data;
  },
  getByAssessment: async (assessmentId: number) => {
    const res = await httpClient.get(`/assessment-submissions/assessment/${assessmentId}`);
    return res.data;
  },
  addFeedback: async (submissionId: number, feedback: any) => {
    const res = await httpClient.post(`/assessment-submissions/${submissionId}/feedback`, feedback);
    return res.data;
  },
  getAssessmentResults: async (assessmentId: number) => {
    const res = await httpClient.get(`/assessment-submissions/results/${assessmentId}`);
    return res.data;
  }
};
