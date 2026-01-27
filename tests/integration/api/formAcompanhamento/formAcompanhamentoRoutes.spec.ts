import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import app from '../../../../src/main';
import { beforeEach, beforeAll, afterAll, describe, expect, it } from '@jest/globals';

describe('Formulário Acompanhamento API Tests', () => {
  let prisma: PrismaClient;
  let authToken: string;
  let bolsistaId: string;
  let tutorId: string;
  let periodoId: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  beforeEach(async () => {
    // 1. Limpeza
    await prisma.formAcompanhamento.deleteMany().catch(() => {});
    await prisma.bolsista.deleteMany().catch(() => {});
    await prisma.periodoTutoria.deleteMany().catch(() => {});
    await prisma.tutor.deleteMany().catch(() => {});
    await prisma.usuario.deleteMany().catch(() => {});
    await prisma.curso.deleteMany().catch(() => {});

    // 2. Setup completo
    const user = await prisma.usuario.create({
      data: { nome: 'Bolsista Form', email: `bolsista-form-${randomUUID()}@test.com`, senha: '123', status: 'ATIVO' }
    });
    
    const curso = await prisma.curso.create({
        data: { nome: 'Curso Form', codigo: `CF-${randomUUID()}`, descricao: 'D' }
    });

    const bolsista = await prisma.bolsista.create({
        data: { usuarioId: user.id, curso: 'TI', anoIngresso: 2024 }
    });
    bolsistaId = bolsista.id;

    // Criar Tutor (FK necessária)
    const userTutor = await prisma.usuario.create({
        data: { nome: 'Tutor Form', email: `tutor-form-${randomUUID()}@test.com`, senha: '123', status: 'ATIVO' }
    });
    const tutor = await prisma.tutor.create({ data: { usuarioId: userTutor.id } });
    tutorId = tutor.id;

    // Criar Periodo (FK necessária)
    const periodo = await prisma.periodoTutoria.create({
        data: { nome: '2024.1', dataInicio: new Date(), dataFim: new Date() }
    });
    periodoId = periodo.id;

    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    authToken = `Bearer ${jwt.sign({ id: user.id, userId: user.id, role: 'scholarship_holder', email: user.email }, process.env.JWT_SECRET)}`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/forms-acompanhamento', () => {
      it('deve criar um formulário', async () => {
          const response = await request(app)
            .post('/api/forms-acompanhamento')
            .set('Authorization', authToken)
            .send({
                bolsistaId,
                tutorId,
                periodoId,
                modalidadeReuniao: 'VIRTUAL',
                maiorDificuldadeAluno: 'Conexão internet',
                quantidadeReunioes: 4,
                descricaoDificuldade: 'Internet instável',
                nomeAluno: 'Bolsista Teste',
                nomeTutor: 'Tutor Teste'
            });

          expect([200, 201]).toContain(response.status);
          
          const noBanco = await prisma.formAcompanhamento.findFirst({
              where: { bolsistaId }
          });
          expect(noBanco).toBeTruthy();
          
          const conteudo = noBanco?.conteudo as any;
          expect(conteudo).toBeTruthy();
          expect(conteudo.quantidadeReunioes).toBe(4);
      });
  });

  describe('GET /api/forms-acompanhamento', () => {
      it('deve listar formulários', async () => {
          await prisma.formAcompanhamento.create({
              data: {
                  bolsistaId,
                  tutorId,
                  periodoId,
                  dataEnvio: new Date(),
                  conteudo: {
                      modalidadeReuniao: 'PRESENCIAL',
                      maiorDificuldadeAluno: 'Nenhuma',
                      quantidadeReunioes: 2,
                      descricaoDificuldade: 'Tudo certo',
                      nomeAluno: 'Fulano',
                      nomeTutor: 'Ciclano',
                      status: 'ENVIADO'
                  }
              }
          });

          const response = await request(app)
            .get('/api/forms-acompanhamento')
            .set('Authorization', authToken);

          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
      });
  });
});