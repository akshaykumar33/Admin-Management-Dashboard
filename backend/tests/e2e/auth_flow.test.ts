
import { describe,it,expect } from '@jest/globals';
import request from 'supertest';
import app from '../../src/server';

describe('End-to-End: Auth Flow', () => {
  let token: string;

  it('register new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'e2euser',
      email: 'e2euser@example.com',
      password: 'E2ePass@123'
    });
    expect(res.statusCode).toBe(201);
  });

  it('login user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'e2euser@example.com',
      password: 'E2ePass@123'
    });
    expect(res.statusCode).toBe(200);
    expect(typeof res.body.token).toBe('string');
    token = res.body.token;
  });

  it('get user profile', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('e2euser@example.com');
  });
});
