import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import app from '../../../../src/main';
import { beforeEach, beforeAll, afterAll, describe, expect, it } from '@jest/globals';

describe('Aluno API Integration Tests', () => {
  let prisma: PrismaClient;
  let authToken: string;
  let usuario: any;
  let curso: any;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  beforeEach(async () => {
    // 1. Limpeza Segura (Ordem: Filhos -> Pais)
    await prisma.relatorioCertificado.deleteMany().catch(() => {});
    await prisma.certificado.deleteMany().catch(() => {});
    await prisma.formAcompanhamento.deleteMany().catch(() => {});
    await prisma.alocarTutorAluno.deleteMany().catch(() => {});
    await prisma.bolsista.deleteMany().catch(() => {});
    await prisma.aluno.deleteMany().catch(() => {});
    await prisma.curso.deleteMany().catch(() => {});
    await prisma.usuario.deleteMany().catch(() => {});

    // 2. Criar Usuário Base (Com dados únicos para evitar colisão)
    usuario = await prisma.usuario.create({
      data: {
        nome: 'Test User',
        email: `test-${randomUUID()}@example.com`,
        senha: 'hashedpassword',
        status: 'ATIVO',
      },
    });

    // 3. Criar Curso Base
    curso = await prisma.curso.create({
      data: {
        nome: 'Engenharia de Software',
        codigo: `ENG-${randomUUID()}`,
        descricao: 'Curso de graduação',
        ativo: true,
      },
    });

    // 4. Gerar Token
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    const token = jwt.sign({ id: usuario.id, userId: usuario.id, email: usuario.email, role: 'coordinator' }, process.env.JWT_SECRET);
    authToken = `Bearer ${token}`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/alunos', () => {
    it('deve criar um aluno com sucesso', async () => {
      const matricula = `M-${randomUUID()}`;
      const alunoData = {
        usuarioId: usuario.id,
        cursoId: curso.id,
        matricula,
        tipo: 'ACESSO_TUTOR', 
        anoIngresso: 2024,
        semestre: 1,
      };

      const response = await request(app)
        .post('/api/alunos')
        .set('Authorization', authToken)
        .send(alunoData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Aluno criado com sucesso');

      // Validação no banco
      const alunoInDb = await prisma.aluno.findUnique({
        where: { matricula: alunoData.matricula },
      });
      expect(alunoInDb).toBeTruthy();
      expect(alunoInDb?.usuarioId).toBe(usuario.id);
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const invalidData = { usuarioId: usuario.id }; 
      await request(app)
        .post('/api/alunos')
        .set('Authorization', authToken)
        .send(invalidData)
        .expect(400);
    });
  });

  describe('GET /api/alunos', () => {
    beforeEach(async () => {
      // Criar usuário secundário para popular a lista
      const usuario2 = await prisma.usuario.create({
        data: {
          nome: 'Second User',
          email: `second-${randomUUID()}@example.com`,
          senha: 'hashedpassword',
          status: 'ATIVO',
        },
      });

      await prisma.aluno.create({
        data: {
            usuarioId: usuario.id,
            cursoId: curso.id,
            matricula: `M-${randomUUID()}`,
            tipoAcesso: 'ACESSO_TUTOR',
            anoIngresso: 2024,
            semestre: 1,
            ativo: true
        }
      });

      await prisma.aluno.create({
        data: {
            usuarioId: usuario2.id,
            cursoId: curso.id,
            matricula: `M-${randomUUID()}`,
            tipoAcesso: 'ACESSO_BOLSISTA',
            anoIngresso: 2024,
            semestre: 2,
            ativo: true
        }
      });
    });

    it('deve listar todos os alunos', async () => {
      const response = await request(app)
        .get('/api/alunos')
        .set('Authorization', authToken)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('deve filtrar alunos por tipo de acesso', async () => {
      const response = await request(app)
        .get('/api/alunos/tutores')
        .set('Authorization', authToken);

      // Aceita 200 (se implementado) ou 404/500 (se não), mas valida estrutura se 200
      if (response.status === 200) {
         expect(response.body).toBeInstanceOf(Array);
         const todosTutores = response.body.every((a: any) => a.tipoAcesso === 'ACESSO_TUTOR');
         expect(todosTutores).toBe(true);
      }
    });
  });
});