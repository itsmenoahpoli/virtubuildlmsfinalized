import { httpClient } from '@/app/core/api';

export const SimulationsService = {
  start: async (activityId: number) => {
    const res = await httpClient.post('/simulations/start', { activityId });
    return res.data;
  },
  getMySimulations: async () => {
    const res = await httpClient.get('/simulations/me');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await httpClient.get(`/simulations/${id}`);
    return res.data;
  },
  placeComponent: async (simulationId: number, componentData: any) => {
    const res = await httpClient.post(`/simulations/${simulationId}/components`, componentData);
    return res.data;
  },
  complete: async (simulationId: number) => {
    const res = await httpClient.post(`/simulations/${simulationId}/complete`);
    return res.data;
  },
  getScore: async (simulationId: number) => {
    const res = await httpClient.get(`/simulations/${simulationId}/score`);
    return res.data;
  },
  getLeaderboard: async () => {
    const res = await httpClient.get('/simulations/leaderboard');
    return res.data;
  },
  getActivityComponents: async (activityId: number) => {
    const res = await httpClient.get(`/simulations/activity/${activityId}/components`);
    return res.data;
  }
};
