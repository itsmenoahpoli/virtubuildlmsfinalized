import request from 'supertest';
import { app } from '@/app.bootstrap';
import { AdminController } from '@/modules/admin/admin.controller';
import { AdminService } from '@/modules/admin/admin.service';
import { initializeDatabase } from '@/database';
import { runSeed } from '@/seed';
import JWT from 'jsonwebtoken';
import { SETTINGS } from '@/configs';

describe('AdminController', () => {
  let adminController: AdminController;
  let adminService: AdminService;
  let adminToken: string;

  beforeAll(async () => {
    await initializeDatabase();
    await runSeed();
    adminController = new AdminController();
    adminService = (adminController as any).adminService;

    adminToken = JWT.sign(
      { user: { id: 1, email: 'admin@example.com', userRoleId: 1, roleName: 'Admin' } },
      SETTINGS.APP_JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/admin/dashboard/stats', () => {
    it('should get admin dashboard stats', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard/stats');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/admin/users', () => {
    it('should get all users for admin', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/admin/users');

      expect(response.status).toBe(401);
    });

    it('should return 403 for non-admin user', async () => {
      const studentToken = JWT.sign(
        { user: { id: 2, email: 'student@example.com', userRoleId: 2, roleName: 'Student' } },
        SETTINGS.APP_JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/admin/users/:id', () => {
    it('should update user', async () => {
      const userId = 1;
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const response = await request(app)
        .put(`/api/admin/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const userId = 1;
      const updateData = {
        firstName: 'Updated'
      };

      const response = await request(app)
        .put(`/api/admin/users/${userId}`)
        .send(updateData);

      expect(response.status).toBe(401);
    });

    it('should return 422 for invalid userId format', async () => {
      const updateData = {
        firstName: 'Updated'
      };

      const response = await request(app)
        .put('/api/admin/users/invalid')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(422);
    });
  });


  describe('AdminController methods', () => {
    it('should have required methods', () => {
      expect(typeof adminController.getDashboardStats).toBe('function');
      expect(typeof adminController.getAllUsers).toBe('function');
      expect(typeof adminController.updateUser).toBe('function');
    });

    it('should have adminService instance', () => {
      expect(adminService).toBeInstanceOf(AdminService);
    });
  });
});
