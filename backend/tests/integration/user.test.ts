
import { describe,it,expect,beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/server';
import User from '../../src/models/User.model';

let adminToken: string;

beforeAll(async () => {
  // Seed admin user
  const adminUser = new User({
    username: 'admin',
    email: 'admin@example.com',
    password: 'Admin@123',
    role: 'admin'
  });
  await adminUser.save();

  // Login admin
  const response = await request(app).post('/api/auth/login').send({
    email: 'admin@example.com',
    password: 'Admin@123'
  });
  adminToken = response.body.token;
});

describe('User Management', () => {
  it('admin can create a user', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'User@123',
        role: 'user'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.data.username).toBe('newuser');
  });

  it('user list can be fetched by admin', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
