import request from 'supertest';
import { app } from '@/app.bootstrap';

const signin = async (email: string, password: string) => {
  const res = await request(app).post('/api/auth/signin').send({ email, password });
  return res.body?.data?.authToken as string;
};

describe('Modules E2E', () => {
  let token: string;

  beforeAll(async () => {
    token = await signin('student@example.com', 'Password123!');
  });

  it('should list modules for authenticated user', async () => {
    const res = await request(app).get('/api/modules').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body?.data)).toBeTruthy();
  });
});


