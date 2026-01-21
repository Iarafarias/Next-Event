import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../../../../src/main';
import { beforeEach, beforeAll, afterAll, describe, expect, it } from '@jest/globals';

describe('Bolsista API Integration Tests', () => {
  let prisma: PrismaClient;
  let authToken: string;
  let bolsistaUser: any;
  let bolsistaProfile: any;
  let curso: any;
  let aluno: any;

  beforeAll(async () => {
    prisma = global.__PRISMA__;
  });

  beforeEach(async () => {
    await prisma.formAcompanhamento.deleteMany();
    await prisma.avaliacaoTutoria.deleteMany();
    await prisma.certificado.deleteMany();
    await prisma.aluno.deleteMany();
    await prisma.curso.deleteMany();
    await prisma.usuario.deleteMany();

    bolsistaUser = await prisma.usuario.create({
      data: {
        nome: 'Bolsista Test',
        email: 'bolsista@example.com',
        senha: 'hashedpassword',
        status: 'ATIVO',
      },
    });

    bolsistaProfile = await prisma.bolsista.create({ data: { usuarioId: bolsistaUser.id } });

    curso = await prisma.curso.create({
      data: {
        nome: 'Engenharia de Software',
        codigo: `ENG-${Date.now()}`,
        descricao: 'Curso de graduação',
        ativo: true,
      },
    });

    const studentUser = await prisma.usuario.create({
      data: {
        nome: 'Student Test',
        email: 'student@example.com',
        senha: 'hashedpassword',
        status: 'ATIVO',
      },
    });

    aluno = await prisma.aluno.create({
      data: {
        usuarioId: studentUser.id,
        cursoId: curso.id,
        matricula: `M-${Date.now()}`,
        tipoAcesso: 'ACESSO_BOLSISTA',
        anoIngresso: 2024,
        semestre: 1,
        ativo: true,
      },
    });

    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    const token = jwt.sign({ id: bolsistaUser.id, userId: bolsistaUser.id, email: bolsistaUser.email, role: 'scholarship_holder' }, process.env.JWT_SECRET);
    authToken = `Bearer ${token}`;
  });

  afterAll(async () => {
    await prisma.formAcompanhamento.deleteMany();
    await prisma.avaliacaoTutoria.deleteMany();
    await prisma.certificado.deleteMany();
    await prisma.aluno.deleteMany();
    await prisma.curso.deleteMany();
    await prisma.usuario.deleteMany();
  });

  describe('GET /api/bolsistas/dashboard', () => {
    beforeEach(async () => {
      await prisma.certificado.createMany({
        data: [
          {
            bolsistaId: bolsistaProfile.id,
            titulo: 'Certificate 1',
            instituicao: 'Instituto Teste',
            cargaHoraria: 10,
            categoria: 'EVENTOS',
            dataInicio: new Date(),
            dataFim: new Date(),
            status: 'PENDENTE',
            arquivoUrl: 'url-1-' + Date.now(),
          },
          {
            bolsistaId: bolsistaProfile.id,
            titulo: 'Certificate 2',
            instituicao: 'Instituto Teste',
            cargaHoraria: 8,
            categoria: 'MONITORIA',
            dataInicio: new Date(),
            dataFim: new Date(),
            status: 'APROVADO',
            arquivoUrl: 'url-2-' + Date.now(),
          },
        ],
      });
    });

    it(
      'deve retornar dados do dashboard do bolsista',
      async () => {
        const response = await request(app)
          .get('/api/bolsistas/dashboard')
          .set('Authorization', authToken)
          .expect(200);

        expect(response.body).toHaveProperty('message', 'Dados do dashboard carregados com sucesso');
        expect(response.body.data).toHaveProperty('alunos');
        expect(response.body.data).toHaveProperty('certificados');
        expect(response.body.data).toHaveProperty('formsAcompanhamento');
        expect(response.body.data).toHaveProperty('estatisticasGerais');

        expect(response.body.data.alunos).toHaveProperty('total');
        expect(response.body.data.alunos).toHaveProperty('registros');
        expect(response.body.data.alunos.total).toBeGreaterThanOrEqual(0);
      },
      15000
    );

    it(
      'deve incluir estatísticas de certificados',
      async () => {
        const response = await request(app)
          .get('/api/bolsistas/dashboard')
          .set('Authorization', authToken)
          .expect(200);

        expect(response.body.data.certificados).toHaveProperty('totalPendentes');
        expect(response.body.data.certificados).toHaveProperty('totalAprovados');
        expect(response.body.data.certificados).toHaveProperty('totalRejeitados');
        expect(response.body.data.certificados).toHaveProperty('recentesPendentes');
      },
      15000
    );
  });

  describe('GET /api/bolsistas/alunos', () => {
    it(
      'deve retornar dados dos alunos para bolsista',
      async () => {
        const response = await request(app)
          .get('/api/bolsistas/alunos')
          .set('Authorization', authToken)
          .expect(200);

        expect(response.body).toHaveProperty('message', 'Registros de alunos carregados com sucesso');
        expect(response.body.data).toHaveProperty('total');
        expect(response.body.data).toHaveProperty('porCurso');
        expect(response.body.data).toHaveProperty('porTipo');
        expect(response.body.data).toHaveProperty('registros');

        expect(response.body.estatisticas).toHaveProperty('total');
        expect(response.body.estatisticas).toHaveProperty('porCurso');
        expect(response.body.estatisticas).toHaveProperty('porTipo');
      },
      15000
    );
  });

  describe('GET /api/bolsistas/certificados', () => {
    beforeEach(async () => {
      await prisma.certificado.createMany({
        data: [
          {
            bolsistaId: bolsistaProfile.id,
            titulo: 'Certificate Pending',
            instituicao: 'Instituto',
            cargaHoraria: 5,
            categoria: 'EVENTOS',
            dataInicio: new Date(),
            dataFim: new Date(),
            status: 'PENDENTE',
            arquivoUrl: 'url-pending-' + Date.now(),
          },
          {
            bolsistaId: bolsistaProfile.id,
            titulo: 'Certificate Approved',
            instituicao: 'Instituto',
            cargaHoraria: 6,
            categoria: 'MONITORIA',
            dataInicio: new Date(),
            dataFim: new Date(),
            status: 'APROVADO',
            arquivoUrl: 'url-approved-' + Date.now(),
          },
        ],
      });
    });

    it(
      'deve retornar dados dos certificados',
      async () => {
        const response = await request(app)
          .get('/api/bolsistas/certificados')
          .set('Authorization', authToken)
          .expect(200);

        expect(response.body).toHaveProperty('message', 'Dados de certificados carregados com sucesso');
        expect(response.body.data).toHaveProperty('totalPendentes');
        expect(response.body.data).toHaveProperty('totalAprovados');
        expect(response.body.data).toHaveProperty('totalRejeitados');
        expect(response.body.data).toHaveProperty('recentesPendentes');

        expect(typeof response.body.data.totalPendentes).toBe('number');
        expect(typeof response.body.data.totalAprovados).toBe('number');
      },
      15000
    );
  });

  describe('POST /api/bolsistas/relatorio-consolidado', () => {
    it(
      'deve gerar relatório consolidado',
      async () => {
        const relatorioData = {
          dataInicio: '2024-01-01',
          dataFim: '2024-12-31',
          incluirDetalhes: true,
        };

        const response = await request(app)
          .post('/api/bolsistas/relatorio-consolidado')
          .set('Authorization', authToken)
          .send(relatorioData)
          .expect(200);

        expect(response.body).toHaveProperty('message', 'Relatório consolidado gerado com sucesso');
        expect(response.body.data).toHaveProperty('periodo');
        expect(response.body.data).toHaveProperty('estatisticas');
        expect(response.body.data).toHaveProperty('distribuicaoSatisfacao');
        expect(response.body.data).toHaveProperty('principaisDificuldades');
        expect(response.body.data).toHaveProperty('geradoEm');
        expect(response.body.data).toHaveProperty('geradoPor');

        expect(response.body.data.estatisticas).toHaveProperty('totalAlunos');
        expect(response.body.data.estatisticas).toHaveProperty('totalTutores');
      },
      15000
    );

    it(
      'deve gerar relatório sem parâmetros opcionais',
      async () => {
        const response = await request(app)
          .post('/api/bolsistas/relatorio-consolidado')
          .set('Authorization', authToken)
          .send({})
          .expect(200);

        expect(response.body).toHaveProperty('message', 'Relatório consolidado gerado com sucesso');
        expect(response.body.data).toHaveProperty('periodo');
        expect(response.body.data.periodo).toHaveProperty('nome');
      },
      15000
    );
  });

  describe('Authentication/Authorization', () => {
    it(
      'deve retornar erro 401 sem token de autenticação',
      async () => {
        const response = await request(app).get('/api/bolsistas/dashboard').expect(401);

        // auth middleware may return `{ error: ... }` or `{ message: ... }`
        if (response.body.error) {
          expect(response.body).toHaveProperty('error');
        } else {
          expect(response.body).toHaveProperty('message');
        }
      },
      15000
    );

    it.skip(
      'deve retornar erro 403 para usuário sem papel bolsista',
      async () => {
        const coordinatorToken = 'Bearer coordinator-jwt-token';

        const response = await request(app)
          .get('/api/bolsistas/dashboard')
          .set('Authorization', coordinatorToken)
          .expect(403);

        expect(response.body).toHaveProperty('error');
      },
      15000
    );
  });
});
