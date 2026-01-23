import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../../../src/main';
import { prisma } from '../../../../src/infrastructure/database/prisma';
import jwt from 'jsonwebtoken';

const ROUTE_BASE = '/api/periodo-tutoria';

const obterTokenCoordenador = () => {
    const userId = 'test-coord-id';
    const secret = process.env.JWT_SECRET || 'segredo_padrao_testes';
    return `Bearer ${jwt.sign({ id: userId, role: 'coordinator' }, secret, { expiresIn: '1h' })}`;
};

describe('ROTAS DE PERIODO DE TUTORIA - INTEGRAÇÃO', () => {
    
    beforeAll(async () => {
        await prisma.alocarTutorAluno.deleteMany().catch(() => {});
        await prisma.formAcompanhamento.deleteMany().catch(() => {});
        await prisma.cargaHorariaMinima.deleteMany().catch(() => {});
        await prisma.periodoTutoria.deleteMany().catch(() => {});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST / (Criar)', () => {
        it('Sucesso: Coordenador deve criar um novo período de tutoria', async () => {
            const token = obterTokenCoordenador();

            const response = await request(app)
                .post(ROUTE_BASE)
                .set('Authorization', token)
                .send({
                    nome: '2025.1',
                    dataInicio: new Date('2025-01-01').toISOString(),
                    dataFim: new Date('2025-06-30').toISOString(),
                    ativo: true,
                    descricao: 'Semestre de Teste Automatizado'
                });

            expect([200, 201]).toContain(response.status);
            expect(response.body).toHaveProperty('id');
            expect(response.body.nome).toBe('2025.1');
        });
    });

    describe('GET / (Listar)', () => {
        it('Sucesso: Deve listar todos os períodos', async () => {
            const token = obterTokenCoordenador();
            const response = await request(app).get(ROUTE_BASE).set('Authorization', token);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe('PUT /:id (Atualizar)', () => {
        it('Sucesso: Deve atualizar os dados do período', async () => {
            const existente = await prisma.periodoTutoria.findFirst();
            if (!existente) throw new Error('Setup falhou');

            const token = obterTokenCoordenador();
            const response = await request(app)
                .put(`${ROUTE_BASE}/${existente.id}`)
                .set('Authorization', token)
                .send({ nome: '2025.1 - Atualizado', ativo: false });

            expect(response.status).toBe(200);
            expect(response.body.nome).toBe('2025.1 - Atualizado');
        });
    });

    describe('DELETE /:id (Remover)', () => {
        it('Sucesso: Deve deletar um período existente', async () => {
            const paraDeletar = await prisma.periodoTutoria.create({
                data: { nome: 'Temp Delete', dataInicio: new Date(), dataFim: new Date(), ativo: false }
            });

            const token = obterTokenCoordenador();
            const response = await request(app)
                .delete(`${ROUTE_BASE}/${paraDeletar.id}`)
                .set('Authorization', token);

            expect(response.status).toBe(204);
            const busca = await prisma.periodoTutoria.findUnique({ where: { id: paraDeletar.id } });
            expect(busca).toBeNull();
        });
    });
});