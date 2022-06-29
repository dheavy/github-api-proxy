import request from 'supertest';
import { Express } from 'express-serve-static-core';
import { createServer } from '../server';

let server: Express;

beforeEach(async () => {
  server = await createServer();
});

describe('GET /', () => {
  test.todo('should return 404 status with usage instructions in error message');
});

// describe('GET /search', () => {

// });
