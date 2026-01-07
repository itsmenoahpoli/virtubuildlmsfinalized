import request from 'supertest';
import { app } from '@/app.bootstrap';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { initializeDatabase } from '@/database';
import { runSeed } from '@/seed';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeAll(async () => {
    await initializeDatabase();
    await runSeed();
    authController = new AuthController();
    authService = authController.authService;
  });

  describe('POST /api/auth/signin', () => {
    it('should sign in with valid credentials', async () => {
      const credentials = {
        email: 'student@example.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body.data.authToken).toBeDefined();
      expect(typeof response.body.data.authToken).toBe('string');
    });

    it('should return 401 for invalid credentials', async () => {
      const credentials = {
        email: 'student@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(credentials);

      expect(response.status).toBe(401);
    });

    it('should return 401 for non-existent user', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(credentials);

      expect(response.status).toBe(401);
    });

    it('should return 422 for invalid email format', async () => {
      const credentials = {
        email: 'invalid-email',
        password: 'Password123!'
      };

      const response = await request(app)
        .post('/api/auth/signin')
        .send(credentials);

      expect(response.status).toBe(422);
    });

    it('should return 422 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({});

      expect(response.status).toBe(422);
    });
  });

  describe('POST /api/auth/signup', () => {
    it('should create new user with valid data', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'Password123!',
        userRoleId: 2
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.password).toBeUndefined();
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
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(422);
    });

    it('should return 422 for invalid email format', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email',
        password: 'Password123!',
        userRoleId: 2
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(422);
    });

    it('should return 422 for weak password', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: '123',
        userRoleId: 2
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData);

      expect(response.status).toBe(422);
    });

    it('should return 422 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({});

      expect(response.status).toBe(422);
    });
  });

  describe('AuthController methods', () => {
    it('should have signinHandler method', () => {
      expect(typeof authController.signinHandler).toBe('function');
    });

    it('should have signupHandler method', () => {
      expect(typeof authController.signupHandler).toBe('function');
    });

    it('should have authService instance', () => {
      expect(authService).toBeInstanceOf(AuthService);
    });
  });
});
