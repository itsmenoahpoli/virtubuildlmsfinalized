import request from 'supertest';
import { app } from '@/app.bootstrap';
import { UsersController } from '@/modules/users/users.controller';
import { UsersService } from '@/modules/users/users.service';
import { initializeDatabase } from '@/database';
import { runSeed } from '@/seed';
import JWT from 'jsonwebtoken';
import { SETTINGS } from '@/configs';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let authToken: string;
  let adminToken: string;

  beforeAll(async () => {
    await initializeDatabase();
    await runSeed();
    usersController = new UsersController();
    usersService = usersController.usersService;

    authToken = JWT.sign(
      { user: { id: 1, email: 'student@example.com', userRoleId: 2, roleName: 'Student' } },
      SETTINGS.APP_JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    adminToken = JWT.sign(
      { user: { id: 1, email: 'admin@example.com', userRoleId: 1, roleName: 'Admin' } },
      SETTINGS.APP_JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );
  });

  describe('GET /api/users', () => {
    it('should get paginated list of users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data.data)).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(10);
    });

    it('should filter users by search term', async () => {
      const response = await request(app)
        .get('/api/users?search=student')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should filter users by role', async () => {
      const response = await request(app)
        .get('/api/users?userRoleId=2')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should filter users by enabled status', async () => {
      const response = await request(app)
        .get('/api/users?isEnabled=true')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/api/users?page=2&limit=5')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.pagination.page).toBe(2);
      expect(response.body.data.pagination.limit).toBe(5);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get user by id', async () => {
      const response = await request(app)
        .get('/api/users/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(1);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/users/1');

      expect(response.status).toBe(401);
    });

    it('should return 422 for invalid id format', async () => {
      const response = await request(app)
        .get('/api/users/invalid')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(422);
    });
  });

  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: 'Password123!',
        userRoleId: 2
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.password).toBeUndefined();
    });

    it('should return 422 for existing email', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'student@example.com',
        password: 'Password123!',
        userRoleId: 2
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      expect(response.status).toBe(422);
    });

    it('should return 422 for invalid data', async () => {
      const userData = {
        firstName: '',
        lastName: 'User',
        email: 'invalid-email',
        password: '123',
        userRoleId: 2
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(userData);

      expect(response.status).toBe(422);
    });

    it('should return 401 without authentication', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: 'Password123!',
        userRoleId: 2
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user by id', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      const response = await request(app)
        .put('/api/users/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.firstName).toBe(updateData.firstName);
      expect(response.body.data.lastName).toBe(updateData.lastName);
    });

    it('should update user password', async () => {
      const updateData = {
        password: 'NewPassword123!'
      };

      const response = await request(app)
        .put('/api/users/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.password).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const updateData = {
        firstName: 'Updated'
      };

      const response = await request(app)
        .put('/api/users/1')
        .send(updateData);

      expect(response.status).toBe(401);
    });

    it('should return 422 for invalid id format', async () => {
      const updateData = {
        firstName: 'Updated'
      };

      const response = await request(app)
        .put('/api/users/invalid')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(422);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user by id', async () => {
      const response = await request(app)
        .delete('/api/users/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .delete('/api/users/1');

      expect(response.status).toBe(401);
    });

    it('should return 422 for invalid id format', async () => {
      const response = await request(app)
        .delete('/api/users/invalid')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(422);
    });
  });

  describe('GET /api/users/me', () => {
    it('should get current user profile', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(1);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/users/me');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update current user profile', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Profile'
      };

      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.firstName).toBe(updateData.firstName);
      expect(response.body.data.lastName).toBe(updateData.lastName);
    });

    it('should return 401 without authentication', async () => {
      const updateData = {
        firstName: 'Updated'
      };

      const response = await request(app)
        .put('/api/users/me')
        .send(updateData);

      expect(response.status).toBe(401);
    });
  });

  describe('UsersController methods', () => {
    it('should have all required methods', () => {
      expect(typeof usersController.fetchListHandler).toBe('function');
      expect(typeof usersController.fetchByIdHandler).toBe('function');
      expect(typeof usersController.createHandler).toBe('function');
      expect(typeof usersController.updateByIdHandler).toBe('function');
      expect(typeof usersController.deleteByIdHandler).toBe('function');
      expect(typeof usersController.getMyProfileHandler).toBe('function');
      expect(typeof usersController.updateMyProfileHandler).toBe('function');
    });

    it('should have usersService instance', () => {
      expect(usersService).toBeInstanceOf(UsersService);
    });
  });
});
