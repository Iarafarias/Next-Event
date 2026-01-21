"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ListCoordenadoresUseCase_1 = require("../../../../src/application/user/use-cases/ListCoordenadoresUseCase");
const Usuario_1 = require("../../../../src/domain/user/entities/Usuario");
describe('ListCoordenadoresUseCase', () => {
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
        useCase = new ListCoordenadoresUseCase_1.ListCoordenadoresUseCase(repository);
    });
    it('Sucesso: Deve listar apenas usuários que possuem o perfil de coordenador', async () => {
        const coordenador = new Usuario_1.Usuario({
            nome: 'João Coordenador',
            email: 'joao@test.com',
            senha: 'senha123',
            status: 'ATIVO',
            coordenador: { id: '1', usuarioId: '1', area: 'TI', nivel: 'Sênior' }
        });
        repository.listByRole.mockResolvedValue([coordenador]);
        const resultado = await useCase.execute();
        expect(repository.listByRole).toHaveBeenCalledWith('coordenador');
        expect(resultado).toHaveLength(1);
        expect(resultado[0].id).toBe(coordenador.id);
        expect(resultado[0].nome).toBe(coordenador.nome);
        expect(resultado[0].coordenador).toBeDefined();
    });
    it('Falha: Deve retornar uma lista vazia se não houver coordenadores', async () => {
        repository.listByRole.mockResolvedValue([]);
        const resultado = await useCase.execute();
        expect(resultado).toEqual([]);
    });
});
