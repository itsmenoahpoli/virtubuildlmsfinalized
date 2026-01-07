import request from 'supertest';
import { app } from '@/app.bootstrap';
import { initializeDatabase } from '@/database';
import { runSeed } from '@/seed';

describe('Auth E2E', () => {
  beforeAll(async () => {
    await initializeDatabase();
    await runSeed();
  });

  it('should sign in demo student and return token', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'student@example.com', password: 'Password123!' });
    expect(res.status).toBe(200);
    expect(res.body?.data?.authToken).toBeDefined();
  });
});


