import request from 'supertest';
import { Express } from 'express-serve-static-core';
import { createServer } from '../server';

let server: Express;

beforeEach(async () => {
  server = await createServer();
});

describe('GET /', () => {
  it('should return 404 status with usage instructions in error message', async () => {
    const response = await request(server).get('/')

    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchObject({
      data: null,
      errors: ['This resource does not exist. Please try endpoint "/search?q=<QUERY>"']
    });
  });
});

// describe('GET /search', () => {

// });
