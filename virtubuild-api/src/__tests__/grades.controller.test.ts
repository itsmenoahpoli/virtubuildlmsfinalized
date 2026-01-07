import request from 'supertest';
import { app } from '@/app.bootstrap';
import { GradesController } from '@/modules/grades/grades.controller';
import { GradesService } from '@/modules/grades/grades.service';
import { initializeDatabase } from '@/database';
import { runSeed } from '@/seed';
import JWT from 'jsonwebtoken';
import { SETTINGS } from '@/configs';

describe('GradesController', () => {
  let gradesController: GradesController;
  let gradesService: GradesService;
  let authToken: string;

  beforeAll(async () => {
    await initializeDatabase();
    await runSeed();
    gradesController = new GradesController();
    gradesService = gradesController.gradesService;

    authToken = JWT.sign(
      { user: { id: 1, email: 'student@example.com', userRoleId: 2, roleName: 'Student' } },
      SETTINGS.APP_JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/grades/me', () => {
    it('should get my grades', async () => {
      const response = await request(app)
        .get('/api/grades/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/grades/me');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/grades/activity/:activityId', () => {
    it('should get grades for activity', async () => {
      const activityId = 1;

      const response = await request(app)
        .get(`/api/grades/activity/${activityId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const activityId = 1;

      const response = await request(app)
        .get(`/api/grades/activity/${activityId}`);

      expect(response.status).toBe(401);
    });

    it('should return 422 for invalid activityId format', async () => {
      const response = await request(app)
        .get('/api/grades/activity/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(422);
    });
  });


  describe('GradesController methods', () => {
    it('should have required methods', () => {
      expect(typeof gradesController.listMineHandler).toBe('function');
      expect(typeof gradesController.listForActivityHandler).toBe('function');
    });

    it('should have gradesService instance', () => {
      expect(gradesService).toBeInstanceOf(GradesService);
    });
  });
});
