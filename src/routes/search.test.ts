import request from 'supertest';
import { Express } from 'express-serve-static-core';
import { createServer } from '../server';
import {
  MSG_QUERY_ERROR_INSTRUCTIONS,
  MSG_404_ERROR_INSTRUCTIONS
} from '../constants';

import { Octokit } from '@octokit/rest';
jest.mock('@octokit/rest');

(Octokit as any).mockImplementation(() => {
  return {
    rest: {
      search: {
        users: () => ({
          data: {
            items: [{ foo: 'bar' }, { foo: 'baz'}]
          }
        })
      },
      repos: {
        listForUser: () => ({
          data: {
            items: [{ foo: 'bar' }, { foo: 'baz'}]
          }
        })
      }
    }
  };
});

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
      errors: [MSG_404_ERROR_INSTRUCTIONS]
    });
  });
});

describe('GET /search', () => {
  it('should return 400 and instructions if querystring is missing or malformed', async () => {
    let response = await request(server).get('/search');
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      data: null,
      errors: [MSG_QUERY_ERROR_INSTRUCTIONS]
    });

    response = await request(server).get('/search?q=');
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      data: null,
      errors: [MSG_QUERY_ERROR_INSTRUCTIONS]
    });

    response = await request(server).get('/search?foo=bar');
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      data: null,
      errors: [MSG_QUERY_ERROR_INSTRUCTIONS]
    });
  });
});
