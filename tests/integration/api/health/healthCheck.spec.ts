/// <reference types="jest" />

import { PrismaClient } from '@prisma/client';
import request from 'supertest';

import app from '../../../../src/main';
import { beforeAll, describe, it, expect } from '@jest/globals';

describe('Health Check Integration Test', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = global.__PRISMA__;
  });

  describe('GET /health', () => {
    it(
      'deve retornar status de saúde do servidor',
      async () => {
        const response = await request(app).get('/health').expect(200);

        expect(response.body).toHaveProperty('status', 'ok');
        expect(response.body).toHaveProperty('uptime');
        expect(typeof response.body.uptime).toBe('number');
      },
      10000
    );
  });
  describe('Database Connection', () => {
    it('deve conectar ao banco de dados de teste', async () => {
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      expect(result).toBeDefined();
    });
  });

  describe('API Endpoints Availability', () => {
    it('deve ter endpoints de usuário disponíveis', async () => {
      const response = await request(app).get('/api/users').expect(401);
      expect(response.status).not.toBe(404);
    });

    it('deve ter endpoints de certificados disponíveis', async () => {
      const response = await request(app).get('/api/certificates').expect(401);
      expect(response.status).not.toBe(404);
    });

    it('deve ter endpoints de alunos disponíveis', async () => {
      const response = await request(app).get('/api/alunos').expect(401);
      expect(response.status).not.toBe(404);
    });
  });
});