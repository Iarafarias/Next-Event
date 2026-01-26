import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import app from '../../../../src/main';
import { beforeEach, beforeAll, afterAll, describe, expect, it } from '@jest/globals';

describe('Alocar Tutor-Aluno API Integration', () => {
  let prisma: PrismaClient;
  let authToken: string;
  let tutorId: string;
  let bolsistaId: string;
  let periodoId: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  beforeEach(async () => {
    // 1. Limpeza
    await prisma.alocarTutorAluno.deleteMany().catch(() => {});
    await prisma.bolsista.deleteMany().catch(() => {});
    await prisma.periodoTutoria.deleteMany().catch(() => {});
    await prisma.tutor.deleteMany().catch(() => {});
    await prisma.usuario.deleteMany().catch(() => {});
    await prisma.curso.deleteMany().catch(() => {});

    // 2. Setup: Coordenador
    const coord = await prisma.usuario.create({
      data: { nome: 'Coord', email: `c-${randomUUID()}@test.com`, senha: '123', status: 'ATIVO' }
    });

    // 3. Setup: Tutor
    const userTutor = await prisma.usuario.create({
        data: { nome: 'Tutor', email: `t-${randomUUID()}@test.com`, senha: '123', status: 'ATIVO' }
    });
    const tutor = await prisma.tutor.create({ data: { usuarioId: userTutor.id } });
    tutorId = tutor.id;

    // 4. Setup: Bolsista
    const userBolsista = await prisma.usuario.create({
        data: { nome: 'Bolsista', email: `b-${randomUUID()}@test.com`, senha: '123', status: 'ATIVO' }
    });
    
    const curso = await prisma.curso.create({
        data: { nome: 'Curso B', codigo: `CB-${randomUUID()}`, descricao: 'D' }
    });

    const bolsista = await prisma.bolsista.create({
        data: { 
            usuarioId: userBolsista.id, 
            curso: 'Engenharia',
            anoIngresso: 2024 
        }
    });
    bolsistaId = bolsista.id;

    // 5. Setup: Periodo
    const periodo = await prisma.periodoTutoria.create({
        data: { nome: '2024.1', dataInicio: new Date(), dataFim: new Date(), ativo: true }
    });
    periodoId = periodo.id;

    // 6. Token
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    authToken = `Bearer ${jwt.sign({ id: coord.id, userId: coord.id, role: 'coordinator', email: coord.email }, process.env.JWT_SECRET)}`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/alocacoes', () => {
      it('deve realizar a alocação com sucesso', async () => {
          const response = await request(app)
            .post('/api/alocacoes') 
            .set('Authorization', authToken)
            .send({
                tutorId,
                bolsistaId,
                periodoId,
                dataInicio: new Date().toISOString()
            });

          expect([200, 201]).toContain(response.status);
          
          const vinculo = await prisma.alocarTutorAluno.findFirst({
              where: { tutorId, bolsistaId }
          });
          expect(vinculo).toBeTruthy();
      });
  });
  
  describe('GET /api/alocacoes', () => {
      it('deve listar alocacoes', async () => {
          await prisma.alocarTutorAluno.create({
              data: { 
                  tutorId, 
                  bolsistaId, 
                  periodoId,
                  dataInicio: new Date()
              }
          });

          const response = await request(app)
            .get('/api/alocacoes')
            .set('Authorization', authToken);

          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
      });
  });
});