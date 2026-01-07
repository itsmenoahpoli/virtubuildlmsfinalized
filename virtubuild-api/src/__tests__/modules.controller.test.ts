import request from 'supertest';
import { app } from '@/app.bootstrap';
import { ModulesController } from '@/modules/modules/modules.controller';
import { ModulesService } from '@/modules/modules/modules.service';
import { initializeDatabase } from '@/database';
import { runSeed } from '@/seed';
import JWT from 'jsonwebtoken';
import { SETTINGS } from '@/configs';

describe('ModulesController', () => {
  let modulesController: ModulesController;
  let modulesService: ModulesService;
  let authToken: string;

  beforeAll(async () => {
    await initializeDatabase();
    await runSeed();
    modulesController = new ModulesController();
    modulesService = modulesController.modulesService;

    authToken = JWT.sign(
      { user: { id: 1, email: 'student@example.com', userRoleId: 2, roleName: 'Student' } },
      SETTINGS.APP_JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/modules', () => {
    it('should get all modules', async () => {
      const response = await request(app)
        .get('/api/modules')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/modules');

      expect(response.status).toBe(401);
    });
  });


  describe('ModulesController methods', () => {
    it('should have required methods', () => {
      expect(typeof modulesController.listHandler).toBe('function');
    });

    it('should have modulesService instance', () => {
      expect(modulesService).toBeInstanceOf(ModulesService);
    });
  });
});
