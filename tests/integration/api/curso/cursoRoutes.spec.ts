import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import app from '../../../../src/main';
import { beforeEach, beforeAll, afterAll, describe, expect, it } from '@jest/globals';

describe('Curso API Integration Tests', () => {
  let prisma: PrismaClient;
  let authToken: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  beforeEach(async () => {
    // 1. Limpeza (ordem importa por causa das FKs)
    await prisma.relatorio.deleteMany().catch(() => {});
    await prisma.bolsista.deleteMany().catch(() => {});
    await prisma.aluno.deleteMany().catch(() => {});
    await prisma.coordenador.deleteMany().catch(() => {}); // Limpar coordenadores
    await prisma.curso.deleteMany().catch(() => {});
    await prisma.usuario.deleteMany().catch(() => {});

    // 2. Criar Usuário Coordenador (Geralmente quem cria cursos)
    const coordUser = await prisma.usuario.create({
      data: { 
        nome: 'Coordenador Curso', 
        email: `coord-curso-${randomUUID()}@test.com`, 
        senha: '123', 
        status: 'ATIVO' 
      }
    });

    // Criar registro na tabela de Coordenador para garantir permissões baseadas em banco
    await prisma.coordenador.create({
        data: { usuarioId: coordUser.id }
    });

    // 3. Gerar Token com Role de Coordenador (ou Admin, dependendo da sua regra)
    // Usando 'coordinator' para garantir acesso a rotas de gestão acadêmica
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    const token = jwt.sign(
        { 
            id: coordUser.id, 
            userId: coordUser.id, 
            role: 'coordinator', // Ajustado para coordinator
            email: coordUser.email 
        }, 
        process.env.JWT_SECRET
    );
    authToken = `Bearer ${token}`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const ROUTE_BASE = '/api/cursos';

  describe('POST /api/cursos', () => {
    it('deve criar um curso com sucesso', async () => {
      const cursoData = {
        nome: 'Sistemas de Informação',
        codigo: `SI-${randomUUID()}`,
        descricao: 'Curso de Bacharelado',
        ativo: true
      };

      const response = await request(app)
        .post(ROUTE_BASE)
        .set('Authorization', authToken)
        .send(cursoData);

      if (response.status === 403) {
          console.warn('Alerta: Teste recebeu 403. Verifique se a role "coordinator" tem permissão em /api/cursos');
      }

      expect(response.status).toBe(201);
      
      // Se retornar o objeto, validamos o ID. Se não, validamos a mensagem.
      if (response.body.id) {
          expect(response.body).toHaveProperty('id');
          expect(response.body.nome).toBe(cursoData.nome);
      } else {
          expect(response.body).toHaveProperty('message');
      }

      // Validação Real: Verificar se foi salvo no banco
      const cursoSalvo = await prisma.curso.findUnique({
          where: { codigo: cursoData.codigo }
      });
      expect(cursoSalvo).toBeTruthy();
      expect(cursoSalvo?.nome).toBe(cursoData.nome);
    });

    it('deve falhar ao criar curso com código duplicado', async () => {
        const codigo = `DUP-${randomUUID()}`;
        
        // Cria o primeiro diretamente no banco
        await prisma.curso.create({
            data: { nome: 'Original', codigo, descricao: 'Original' }
        });

        // Tenta criar o segundo igual via API
        const response = await request(app)
            .post(ROUTE_BASE)
            .set('Authorization', authToken)
            .send({
                nome: 'Duplicado',
                codigo: codigo,
                descricao: 'Tentativa de duplicação'
            });

        // Aceita 400 (Bad Request) ou 409 (Conflict)
        expect([400, 409]).toContain(response.status);
    });
  });

  describe('GET /api/cursos', () => {
    it('deve listar todos os cursos', async () => {
      await prisma.curso.createMany({
        data: [
            { nome: 'Curso A', codigo: `A-${randomUUID()}`, descricao: 'Desc A' },
            { nome: 'Curso B', codigo: `B-${randomUUID()}`, descricao: 'Desc B' }
        ]
      });

      const response = await request(app)
        .get(ROUTE_BASE)
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });
  });
});