import request from 'supertest';
import { app } from '@/app.bootstrap';
import { AnalyticsController } from '@/modules/analytics/analytics.controller';
import { AnalyticsService } from '@/modules/analytics/analytics.service';
import { initializeDatabase } from '@/database';
import { runSeed } from '@/seed';
import JWT from 'jsonwebtoken';
import { SETTINGS } from '@/configs';

describe('AnalyticsController', () => {
  let analyticsController: AnalyticsController;
  let analyticsService: AnalyticsService;
  let authToken: string;

  beforeAll(async () => {
    await initializeDatabase();
    await runSeed();
    analyticsController = new AnalyticsController();
    analyticsService = analyticsController.analyticsService;

    authToken = JWT.sign(
      { user: { id: 1, email: 'student@example.com', userRoleId: 2, roleName: 'Student' } },
      SETTINGS.APP_JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/analytics/me', () => {
    it('should get my performance analytics', async () => {
      const response = await request(app)
        .get('/api/analytics/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/analytics/me');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/analytics/dashboard', () => {
    it('should get analytics dashboard', async () => {
      const response = await request(app)
        .get('/api/analytics/dashboard')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/analytics/dashboard');

      expect(response.status).toBe(401);
    });
  });

  describe('AnalyticsController methods', () => {
    it('should have required methods', () => {
      expect(typeof analyticsController.getMineHandler).toBe('function');
      expect(typeof analyticsController.getDashboardHandler).toBe('function');
    });

    it('should have analyticsService instance', () => {
      expect(analyticsService).toBeInstanceOf(AnalyticsService);
    });
  });
});
