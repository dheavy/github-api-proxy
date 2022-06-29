import express from 'express';
import { Express } from 'express-serve-static-core';
import cors from 'cors';

export async function createServer(): Promise<Express> {
  const server = express();

  server.use(cors());
  server.use(express.json());

  return server;
}
