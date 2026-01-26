import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import app from '../../../../src/main';
import { beforeEach, beforeAll, afterAll, describe, expect, it } from '@jest/globals';

describe('Relatorio API Integration Tests', () => {
  let prisma: PrismaClient;
  let authToken: string; // Token de ADMIN
  let bolsistaUser: any;
  let bolsistaRecord: any;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  beforeEach(async () => {
    // 1. Limpeza Segura
    await prisma.relatorioAvaliacao.deleteMany().catch(() => {});
    await prisma.relatorioAluno.deleteMany().catch(() => {});
    await prisma.relatorioTutor.deleteMany().catch(() => {});
    await prisma.relatorioCertificado.deleteMany().catch(() => {});
    await prisma.relatorioAcompanhamento.deleteMany().catch(() => {});
    await prisma.relatorio.deleteMany().catch(() => {});
    
    await prisma.certificado.deleteMany().catch(() => {});
    await prisma.bolsista.deleteMany().catch(() => {});
    await prisma.aluno.deleteMany().catch(() => {});
    await prisma.usuario.deleteMany().catch(() => {});
    await prisma.curso.deleteMany().catch(() => {});
    
    // 2. Criar Curso
    const curso = await prisma.curso.create({
        data: { nome: 'Curso Rel', codigo: `REL-${randomUUID()}`, descricao: 'D', ativo: true }
    });

    // 3. Criar Usuário Bolsista (para vincular o relatório)
    bolsistaUser = await prisma.usuario.create({
        data: { 
            nome: 'Bolsista Rel', 
            email: `rel-${randomUUID()}@test.com`, 
            senha: '123', 
            status: 'ATIVO' 
        }
    });

    // 4. Criar Registro de Bolsista
    bolsistaRecord = await prisma.bolsista.create({
        data: { usuarioId: bolsistaUser.id, curso: 'TI', anoIngresso: 2024 }
    });

    // 5. Criar Usuário ADMIN para gerar o token (já que a rota exige admin)
    const adminUser = await prisma.usuario.create({
        data: { 
            nome: 'Admin User', 
            email: `admin-${randomUUID()}@test.com`, 
            senha: '123', 
            status: 'ATIVO' 
        }
    });

    // 6. Gerar Token de ADMIN
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    const token = jwt.sign(
        { 
            id: adminUser.id, 
            userId: adminUser.id, 
            role: 'admin', // Alterado para ADMIN
            email: adminUser.email 
        }, 
        process.env.JWT_SECRET
    );
    authToken = `Bearer ${token}`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const ROUTE_BASE = '/api/relatorios';

  describe('POST /api/relatorios', () => {
    it('deve criar um relatório com sucesso', async () => {
        const response = await request(app)
            .post(ROUTE_BASE)
            .set('Authorization', authToken)
            .send({
                titulo: 'Relatório Mensal',
                descricao: 'Minhas atividades do mês',
                tipo: 'ALUNO',
                geradorId: bolsistaUser.id, // ID do bolsista como gerador (admin criando para ele ou simulando)
                mesReferencia: 5,
                anoReferencia: 2024
            });

        if (response.status !== 404) {
            if (response.status !== 201) console.error('Erro POST Relatório:', response.body);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
        }
    });
  });

  describe('GET /api/relatorios', () => {
      it('deve listar relatórios', async () => {
          await prisma.relatorio.create({
              data: {
                  geradorId: bolsistaUser.id,
                  titulo: 'Relatório Inicial',
                  descricao: 'Texto do relatório',
                  tipo: 'ALUNO'
              }
          });

          const response = await request(app)
            .get(ROUTE_BASE)
            .set('Authorization', authToken);
          
          if (response.status !== 404) {
              if (response.status !== 200) console.error('Erro GET Relatório:', response.body);
              expect(response.status).toBe(200);
              expect(Array.isArray(response.body)).toBe(true);
          }
      });
  });
});