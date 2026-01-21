import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../../../../src/main';
import { beforeEach, beforeAll, afterAll, describe, expect, it } from '@jest/globals';

describe('Aluno API Integration Tests', () => {
  let prisma: PrismaClient;
  let authToken: string;
  let usuario: any;
  let curso: any;

  beforeAll(async () => {
    prisma = global.__PRISMA__;
  });

  beforeEach(async () => {
    await prisma.certificado.deleteMany();
    await prisma.formAcompanhamento.deleteMany();
    await prisma.aluno.deleteMany();
    await prisma.curso.deleteMany();
    await prisma.usuario.deleteMany();

    usuario = await prisma.usuario.create({
      data: {
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'hashedpassword',
        // 'papel' is not a field in the Prisma `Usuario` model
        status: 'ATIVO',
      },
    });

    curso = await prisma.curso.create({
      data: {
        nome: 'Engenharia de Software',
        codigo: `ENG-${Date.now()}`,
        descricao: 'Curso de graduação',
        ativo: true,
      },
    });

    // ensure a known secret for tests and generate a valid token
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    const token = jwt.sign({ id: usuario.id, userId: usuario.id, email: usuario.email, role: 'coordinator' }, process.env.JWT_SECRET);
    authToken = `Bearer ${token}`;
  });

  afterAll(async () => {
    await prisma.aluno.deleteMany();
    await prisma.curso.deleteMany();
    await prisma.usuario.deleteMany();
  });

  describe('POST /api/alunos', () => {
    it(
      'deve criar um aluno com sucesso',
      async () => {
        const matricula = `M-${Date.now()}`;
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
          .send(alunoData)
          .expect(201);

        expect(response.body).toHaveProperty('message', 'Aluno criado com sucesso');

        const alunoInDb = await prisma.aluno.findUnique({
          where: { matricula: alunoData.matricula },
        });
        expect(alunoInDb).toBeTruthy();
        expect(alunoInDb?.usuarioId).toBe(usuario.id);
      },
      15000
    );

    it(
      'deve retornar erro 400 para dados inválidos',
      async () => {
        const invalidData = {
          usuarioId: usuario.id,
          // Missing required fields
        };

        const response = await request(app)
          .post('/api/alunos')
          .set('Authorization', authToken)
          .send(invalidData)
          .expect(400);

        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('Campos obrigatórios');
      },
      15000
    );

    it(
      'deve retornar erro 400 para usuário inexistente',
      async () => {
        const alunoData = {
          usuarioId: 'inexistent-user-id',
          cursoId: curso.id,
          matricula: '2024002',
          tipo: 'ACESSO_TUTOR',
        };

        const response = await request(app)
          .post('/api/alunos')
          .set('Authorization', authToken)
          .send(alunoData)
          .expect(400);

        expect(response.body).toHaveProperty('error');
      },
      15000
    );
  });

  describe('GET /api/alunos', () => {
    beforeEach(async () => {
      // create a second user so usuarioId uniqueness constraint isn't violated
      const usuario2 = await prisma.usuario.create({
        data: {
          nome: 'Second User',
          email: `second-${Date.now()}@example.com`,
          senha: 'hashedpassword',
          status: 'ATIVO',
        },
      });

      const base = Date.now();
      await prisma.aluno.createMany({
        data: [
          {
            usuarioId: usuario.id,
            cursoId: curso.id,
            matricula: `M-${base}-1`,
            tipoAcesso: 'ACESSO_TUTOR',
            anoIngresso: 2024,
            semestre: 1,
            ativo: true,
          },
          {
            usuarioId: usuario2.id,
            cursoId: curso.id,
            matricula: `M-${base}-2`,
            tipoAcesso: 'ACESSO_BOLSISTA',
            anoIngresso: 2024,
            semestre: 2,
            ativo: true,
          },
        ],
      });
    });

    it(
      'deve listar todos os alunos',
      async () => {
        const response = await request(app)
          .get('/api/alunos')
          .set('Authorization', authToken)
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(2);
      },
      15000
    );

    it(
      'deve filtrar alunos por tipo de acesso',
      async () => {
        const response = await request(app)
          .get('/api/alunos/tutores')
          .set('Authorization', authToken)
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].tipoAcesso).toBe('ACESSO_TUTOR');
      },
      15000
    );
  });

  describe('GET /api/alunos/bolsistas', () => {
    beforeEach(async () => {
      await prisma.aluno.create({
        data: {
          usuarioId: usuario.id,
          cursoId: curso.id,
          matricula: `M-${Date.now()}`,
          tipoAcesso: 'ACESSO_BOLSISTA',
          anoIngresso: 2024,
          semestre: 1,
          ativo: true,
        },
      });
    });

    it(
      'deve listar alunos bolsistas',
      async () => {
        const response = await request(app)
          .get('/api/alunos/bolsistas')
          .set('Authorization', authToken)
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].tipoAcesso).toBe('ACESSO_BOLSISTA');
      },
      15000
    );
  });
});
