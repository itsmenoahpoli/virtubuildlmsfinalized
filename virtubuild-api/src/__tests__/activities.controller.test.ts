import request from 'supertest';
import { app } from '@/app.bootstrap';
import { ActivitiesController } from '@/modules/activities/activities.controller';
import { ActivitiesService } from '@/modules/activities/activities.service';
import { initializeDatabase } from '@/database';
import { runSeed } from '@/seed';
import JWT from 'jsonwebtoken';
import { SETTINGS } from '@/configs';

describe('ActivitiesController', () => {
  let activitiesController: ActivitiesController;
  let activitiesService: ActivitiesService;
  let authToken: string;

  beforeAll(async () => {
    await initializeDatabase();
    await runSeed();
    activitiesController = new ActivitiesController();
    activitiesService = activitiesController.activitiesService;

    authToken = JWT.sign(
      { user: { id: 1, email: 'student@example.com', userRoleId: 2, roleName: 'Student' } },
      SETTINGS.APP_JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/activities/module/:moduleId', () => {
    it('should get activities by module id', async () => {
      const moduleId = 1;

      const response = await request(app)
        .get(`/api/activities/module/${moduleId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const moduleId = 1;

      const response = await request(app)
        .get(`/api/activities/module/${moduleId}`);

      expect(response.status).toBe(401);
    });

    it('should return 422 for invalid moduleId format', async () => {
      const response = await request(app)
        .get('/api/activities/module/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(422);
    });
  });

  describe('GET /api/activities/:id', () => {
    it('should get activity by id', async () => {
      const activityId = 1;

      const response = await request(app)
        .get(`/api/activities/${activityId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const activityId = 1;

      const response = await request(app)
        .get(`/api/activities/${activityId}`);

      expect(response.status).toBe(401);
    });

    it('should return 422 for invalid id format', async () => {
      const response = await request(app)
        .get('/api/activities/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(422);
    });
  });

  describe('ActivitiesController methods', () => {
    it('should have all required methods', () => {
      expect(typeof activitiesController.listAllHandler).toBe('function');
      expect(typeof activitiesController.getByIdHandler).toBe('function');
      expect(typeof activitiesController.updateHandler).toBe('function');
    });

    it('should have activitiesService instance', () => {
      expect(activitiesService).toBeInstanceOf(ActivitiesService);
    });
  });
});
