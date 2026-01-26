import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import app from '../../../../src/main';
import { beforeEach, beforeAll, afterAll, describe, expect, it } from '@jest/globals';

describe('Carga Horária Mínima API Tests', () => {
  let prisma: PrismaClient;
  let authToken: string;
  let periodoId: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  beforeEach(async () => {
    // 1. Limpeza
    await prisma.cargaHorariaMinima.deleteMany().catch(() => {});
    await prisma.periodoTutoria.deleteMany().catch(() => {});
    await prisma.usuario.deleteMany().catch(() => {});

    // 2. Setup: Coordenador
    const coord = await prisma.usuario.create({
      data: { nome: 'Coord CH', email: `coord-ch-${randomUUID()}@test.com`, senha: '123', status: 'ATIVO' }
    });

    // 3. Setup: Período
    const periodo = await prisma.periodoTutoria.create({
        data: { nome: '2024.1', dataInicio: new Date(), dataFim: new Date(), ativo: true }
    });
    periodoId = periodo.id;

    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    authToken = `Bearer ${jwt.sign({ id: coord.id, userId: coord.id, role: 'coordinator', email: coord.email }, process.env.JWT_SECRET)}`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/cargas-horarias', () => {
      it('deve criar configuração de carga horária', async () => {
          const response = await request(app)
            .post('/api/cargas-horarias')
            .set('Authorization', authToken)
            .send({
                periodoId,
                categoria: 'MONITORIA',
                horasMinimas: 12,
                descricao: 'Mínimo para aprovação'
            });

          expect([200, 201]).toContain(response.status);
          
          const noBanco = await prisma.cargaHorariaMinima.findFirst({
              where: { periodoId, categoria: 'MONITORIA' }
          });
          expect(noBanco).toBeTruthy();
          expect(noBanco?.horasMinimas).toBe(12);
      });
  });

  describe('GET /api/cargas-horarias', () => {
      it('deve listar configurações', async () => {
          await prisma.cargaHorariaMinima.create({
              data: {
                  periodoId,
                  categoria: 'EVENTOS',
                  horasMinimas: 5,
                  descricao: 'Eventos obrigatórios'
              }
          });

          const response = await request(app)
            .get('/api/cargas-horarias')
            .set('Authorization', authToken);

          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
      });
  });
});