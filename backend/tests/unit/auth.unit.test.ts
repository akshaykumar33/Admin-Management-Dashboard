import { describe,it,expect } from '@jest/globals';
import request from 'supertest';
import app from '../../src/server';
import User from '../../src/models/User.model';

describe('Auth API', () => {
  it('should register a new user', async () => {
    const response = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Test@1234',
      role: 'user'
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe('testuser@example.com');
  });

  it('should login an existing user', async () => {
    // Seed user
    const user = new User({
      username: 'loginuser',
      email: 'loginuser@example.com',
      password: 'Test@1234',
      role: 'user'
    });
    await user.save();

    const response = await request(app).post('/api/auth/login').send({
      email: 'loginuser@example.com',
      password: 'Test@1234'
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(typeof response.body.token).toBe('string');
    expect(response.body.user.email).toBe('loginuser@example.com');
  });
});
