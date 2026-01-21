"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ListTutoresUseCase_1 = require("../../../../src/application/user/use-cases/ListTutoresUseCase");
const Usuario_1 = require("../../../../src/domain/user/entities/Usuario");
describe('ListTutoresUseCase', () => {
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
        useCase = new ListTutoresUseCase_1.ListTutoresUseCase(repository);
    });
    it('Sucesso: Deve listar apenas usuários que possuem o perfil de tutor', async () => {
        const tutor = new Usuario_1.Usuario({
            nome: 'João Tutor',
            email: 'joao.tutor@test.com',
            senha: 'senha123',
            status: 'ATIVO',
            tutor: { id: '1', usuarioId: '1', area: 'Matemática', nivel: 'Doutorado', capacidadeMaxima: 10 }
        });
        repository.listByRole.mockResolvedValue([tutor]);
        const resultado = await useCase.execute();
        expect(repository.listByRole).toHaveBeenCalledWith('tutor');
        expect(resultado).toHaveLength(1);
        expect(resultado[0].id).toBe(tutor.id);
        expect(resultado[0].nome).toBe(tutor.nome);
        expect(resultado[0].tutor).toBeDefined();
    });
    it('Falha: Deve retornar uma lista vazia se não houver tutores', async () => {
        repository.listByRole.mockResolvedValue([]);
        const resultado = await useCase.execute();
        expect(resultado).toEqual([]);
    });
});
