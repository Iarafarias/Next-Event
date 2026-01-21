"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ListBolsistasUseCase_1 = require("../../../../src/application/user/use-cases/ListBolsistasUseCase");
const Usuario_1 = require("../../../../src/domain/user/entities/Usuario");
describe('ListBolsistasUseCase', () => {
    let repository;
    let useCase;
    beforeEach(() => {
        repository = {
            listByRole: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
        };
        useCase = new ListBolsistasUseCase_1.ListBolsistasUseCase(repository);
    });
    it('Sucesso: Deve listar apenas usuários que possuem o perfil de bolsista', async () => {
        const bolsista = new Usuario_1.Usuario({
            nome: 'Maria Bolsista',
            email: 'maria.bolsista@test.com',
            senha: 'senha123',
            status: 'ATIVO',
            bolsista: { id: '1', usuarioId: '1', curso: 'Engenharia', anoIngresso: 2024 }
        });
        repository.listByRole.mockResolvedValue([bolsista]);
        const resultado = await useCase.execute();
        expect(repository.listByRole).toHaveBeenCalledWith('bolsista');
        expect(resultado).toHaveLength(1);
        expect(resultado[0].id).toBe(bolsista.id);
        expect(resultado[0].nome).toBe(bolsista.nome);
        expect(resultado[0].bolsista).toBeDefined();
    });
    it('Falha: Deve retornar uma lista vazia se não houver bolsistas', async () => {
        repository.listByRole.mockResolvedValue([]);
        const resultado = await useCase.execute();
        expect(resultado).toEqual([]);
    });
});
