import request from 'supertest';
import { Express } from 'express-serve-static-core';
import { createServer } from '../server';
import {
  MSG_QUERY_ERROR_INSTRUCTIONS,
  MSG_404_ERROR_INSTRUCTIONS,
  MSG_ERROR_RATE_GITHUB,
  MSG_RATE_LIMIT_INSTRUCTIONS,
  MSG_ERROR_UNKNOWN
} from '../constants';

import { Octokit } from '@octokit/rest';
jest.mock('@octokit/rest');

let server: Express;

beforeEach(async () => {
  jest.clearAllMocks();
  server = await createServer();
});

type ConsoleError =  {
  (...data: any[]): void;
  (message?: any, ...optionalParams: any[]): void;
}

let consoleError: ConsoleError;

beforeAll(() => {
  consoleError = console.error;
  console.error = jest.fn();
});

afterAll(() => {
  console.error = consoleError;
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
  beforeEach(() => {
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
              data: [
                [{ foo: 'bar' }, { foo: 'baz'}]
              ]
            })
          }
        }
      };
    });
  });

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

  it('should return 200 when Github API successfully returns data', async () => {
    const response = await request(server).get('/search?q=dheavy');
    expect(response.statusCode).toBe(200);
  });

  it('should return a payload of shape { data: { users: { ..., items: Array }, repositories: Array<Array> } }', async () => {
    const response = await request(server).get('/search?q=dheavy');
    expect(response.body).toBeTruthy();

    const body = response.body;
    expect(body.data).toBeTruthy();
    expect(body.data.users).toBeTruthy();
    expect(body.data.users.items).toBeTruthy();
    expect(Array.isArray(body.data.users.items)).toBe(true);
    expect(body.data.repositories).toBeTruthy();
    expect(Array.isArray(body.data.repositories[0])).toBe(true);
  });

  it('should return 429 (Too Many Request) and a specific message when rate limit is exceeded', async () => {
    (Octokit as any).mockImplementation(() => {
      return {
        rest: {
          search: {
            users: () => {
              throw new Error(MSG_ERROR_RATE_GITHUB)
            }
          }
        }
      };
    });

    const response = await request(server).get('/search?q=dheavy');
    expect(response.statusCode).toBe(429);
    expect(response.body).toMatchObject({
      data: null,
      errors: [MSG_RATE_LIMIT_INSTRUCTIONS]
    })
  });

  it('should return 500 and a specific error message on other issues', async () => {
    (Octokit as any).mockImplementation(() => {
      return {
        rest: {
          search: {
            users: () => {
              throw new Error()
            }
          }
        }
      };
    });

    const response = await request(server).get('/search?q=dheavy');
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject({
      data: null,
      errors: [MSG_ERROR_UNKNOWN]
    })
  });
});
