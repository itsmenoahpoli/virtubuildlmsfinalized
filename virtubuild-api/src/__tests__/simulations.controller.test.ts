import request from 'supertest';
import { app } from '@/app.bootstrap';
import { SimulationsController } from '@/modules/simulations/simulations.controller';
import { SimulationsService } from '@/modules/simulations/simulations.service';
import { initializeDatabase } from '@/database';
import { runSeed } from '@/seed';
import JWT from 'jsonwebtoken';
import { SETTINGS } from '@/configs';

describe('SimulationsController', () => {
  let simulationsController: SimulationsController;
  let simulationsService: SimulationsService;
  let authToken: string;

  beforeAll(async () => {
    await initializeDatabase();
    await runSeed();
    simulationsController = new SimulationsController();
    simulationsService = simulationsController.simulationsService;

    authToken = JWT.sign(
      { user: { id: 1, email: 'student@example.com', userRoleId: 2, roleName: 'Student' } },
      SETTINGS.APP_JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );
  });

  describe('POST /api/simulations/start', () => {
    it('should start a new simulation', async () => {
      const simulationData = {
        activityId: 1
      };

      const response = await request(app)
        .post('/api/simulations/start')
        .set('Authorization', `Bearer ${authToken}`)
        .send(simulationData);

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.activityId).toBe(simulationData.activityId);
    });

    it('should return 401 without authentication', async () => {
      const simulationData = {
        activityId: 1
      };

      const response = await request(app)
        .post('/api/simulations/start')
        .send(simulationData);

      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid activityId', async () => {
      const simulationData = {
        activityId: 'invalid'
      };

      const response = await request(app)
        .post('/api/simulations/start')
        .set('Authorization', `Bearer ${authToken}`)
        .send(simulationData);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/simulations/:id', () => {
    it('should get simulation details', async () => {
      const simulationId = 1;

      const response = await request(app)
        .get(`/api/simulations/${simulationId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should return 404 for non-existent simulation', async () => {
      const simulationId = 999;

      const response = await request(app)
        .get(`/api/simulations/${simulationId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 without authentication', async () => {
      const simulationId = 1;

      const response = await request(app)
        .get(`/api/simulations/${simulationId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/simulations/me', () => {
    it('should get user simulations', async () => {
      const response = await request(app)
        .get('/api/simulations/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/simulations/me');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/simulations/:id/components', () => {
    it('should place component in simulation', async () => {
      const simulationId = 1;
      const componentData = {
        componentId: 'cpu-001',
        x: 0,
        y: 0,
        z: 0,
        rotation: { x: 0, y: 0, z: 0 },
        metadata: { type: 'CPU' }
      };

      const response = await request(app)
        .post(`/api/simulations/${simulationId}/components`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(componentData);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const simulationId = 1;
      const componentData = {
        componentId: 'cpu-001',
        x: 0,
        y: 0,
        z: 0
      };

      const response = await request(app)
        .post(`/api/simulations/${simulationId}/components`)
        .send(componentData);

      expect(response.status).toBe(401);
    });

    it('should return 400 for missing required fields', async () => {
      const simulationId = 1;
      const componentData = {
        x: 0,
        y: 0,
        z: 0
      };

      const response = await request(app)
        .post(`/api/simulations/${simulationId}/components`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(componentData);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/simulations/:id/complete', () => {
    it('should complete simulation', async () => {
      const simulationId = 1;
      const completionData = {
        score: 85,
        timeSpentSeconds: 300,
        errors: 2,
        finalState: { completed: true }
      };

      const response = await request(app)
        .post(`/api/simulations/${simulationId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(completionData);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const simulationId = 1;
      const completionData = {
        score: 85,
        timeSpentSeconds: 300
      };

      const response = await request(app)
        .post(`/api/simulations/${simulationId}/complete`)
        .send(completionData);

      expect(response.status).toBe(401);
    });

    it('should return 400 for missing required fields', async () => {
      const simulationId = 1;
      const completionData = {
        score: 85
      };

      const response = await request(app)
        .post(`/api/simulations/${simulationId}/complete`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(completionData);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/simulations/:id/score', () => {
    it('should get simulation score', async () => {
      const simulationId = 1;

      const response = await request(app)
        .get(`/api/simulations/${simulationId}/score`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should return 404 for non-existent simulation', async () => {
      const simulationId = 999;

      const response = await request(app)
        .get(`/api/simulations/${simulationId}/score`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 without authentication', async () => {
      const simulationId = 1;

      const response = await request(app)
        .get(`/api/simulations/${simulationId}/score`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/simulations/leaderboard', () => {
    it('should get leaderboard', async () => {
      const response = await request(app)
        .get('/api/simulations/leaderboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get leaderboard filtered by activityId', async () => {
      const response = await request(app)
        .get('/api/simulations/leaderboard?activityId=1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/simulations/leaderboard');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/simulations/activity/:activityId/components', () => {
    it('should get simulation components', async () => {
      const activityId = 1;

      const response = await request(app)
        .get(`/api/simulations/activity/${activityId}/components`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should return 404 for non-existent activity', async () => {
      const activityId = 999;

      const response = await request(app)
        .get(`/api/simulations/activity/${activityId}/components`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 401 without authentication', async () => {
      const activityId = 1;

      const response = await request(app)
        .get(`/api/simulations/activity/${activityId}/components`);

      expect(response.status).toBe(401);
    });
  });

  describe('SimulationsController methods', () => {
    it('should have all required methods', () => {
      expect(typeof simulationsController.startSimulation).toBe('function');
      expect(typeof simulationsController.getSimulation).toBe('function');
      expect(typeof simulationsController.getMySimulations).toBe('function');
      expect(typeof simulationsController.placeComponent).toBe('function');
      expect(typeof simulationsController.completeSimulation).toBe('function');
      expect(typeof simulationsController.getSimulationScore).toBe('function');
      expect(typeof simulationsController.getLeaderboard).toBe('function');
      expect(typeof simulationsController.getSimulationComponents).toBe('function');
    });

    it('should have simulationsService instance', () => {
      expect(simulationsService).toBeInstanceOf(SimulationsService);
    });
  });
});
