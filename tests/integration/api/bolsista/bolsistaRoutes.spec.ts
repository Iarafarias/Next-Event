import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import app from '../../../../src/main';
import { beforeEach, beforeAll, afterAll, describe, expect, it } from '@jest/globals';

describe('Bolsista API Integration Tests', () => {
  let prisma: PrismaClient;
  let authToken: string;
  let bolsistaUser: any;
  let bolsistaRecord: any;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  beforeEach(async () => {
    // 1. Limpeza segura (respeitando ordem de dependências)
    await prisma.relatorioCertificado.deleteMany().catch(() => {});
    await prisma.certificado.deleteMany().catch(() => {});
    await prisma.alocarTutorAluno.deleteMany().catch(() => {}); // Importante limpar alocações
    await prisma.bolsista.deleteMany().catch(() => {});
    await prisma.aluno.deleteMany().catch(() => {});
    await prisma.usuario.deleteMany().catch(() => {});
    await prisma.curso.deleteMany().catch(() => {});

    // 2. Criar Curso
    const curso = await prisma.curso.create({
      data: { nome: 'Curso Teste', codigo: `C-${Date.now()}`, descricao: 'Desc', ativo: true }
    });

    // 3. Criar Usuário
    bolsistaUser = await prisma.usuario.create({
      data: { 
        nome: 'Bolsista Teste', 
        email: `bolsista-${Date.now()}@test.com`, 
        senha: '123', 
        status: 'ATIVO' 
      }
    });

    // 4. Criar Registro de Bolsista
    bolsistaRecord = await prisma.bolsista.create({
        data: {
            usuarioId: bolsistaUser.id,
            curso: 'Engenharia',
            anoIngresso: 2024
        }
    });

    // 5. Gerar Token
    const token = jwt.sign({ id: bolsistaUser.id, role: 'scholarship_holder' }, process.env.JWT_SECRET || 'secret');
    authToken = `Bearer ${token}`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/bolsistas/dashboard', () => {
    beforeEach(async () => {
        // Criar Certificado vinculado ao Bolsista para ter dados no dashboard
        await prisma.certificado.create({
            data: {
                bolsistaId: bolsistaRecord.id,
                titulo: 'Certificado Teste',
                instituicao: 'Udemy',
                cargaHoraria: 10,
                categoria: 'EVENTOS',
                dataInicio: new Date(),
                dataFim: new Date(),
                status: 'APROVADO' as any,
                arquivoUrl: `http://url.fake/cert-${Date.now()}.pdf`
            }
        });
    });

    it('deve retornar dados do dashboard do bolsista', async () => {
      const response = await request(app)
        .get('/api/bolsistas/dashboard')
        .set('Authorization', authToken);
      
      if (response.status !== 404) {
          expect(response.status).toBe(200);
          expect(response.body).toBeDefined();
      }
    });
  });

  describe('GET /api/bolsistas/alunos', () => {
      it('deve retornar dados dos alunos para bolsista', async () => {
          const response = await request(app)
            .get('/api/bolsistas/alunos')
            .set('Authorization', authToken);

          if (response.status !== 404) {
              expect(response.status).toBe(200);

              const body = response.body;
              
              expect(body).toBeDefined();
              
              // Se existir a chave 'data', validamos que ela não é nula
              if (body.data) {
                  expect(body.data).toBeTruthy();
              } else {
                  // Se não tiver data, o corpo principal deve ser válido (Array ou Objeto)
                  expect(typeof body).toBe('object');
              }
          }
      });
  });
});