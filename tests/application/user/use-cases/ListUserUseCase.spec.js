"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ListUsersUseCase_1 = require("../../../../src/application/user/use-cases/ListUsersUseCase");
const InMemoryUsuarioRepository_1 = require("./../../../builder/InMemoryUsuarioRepository");
const UsuarioBuilder_1 = require("../../../builder/UsuarioBuilder");
describe('ListUsuariosUseCase', () => {
    let repository;
    let useCase;
    beforeEach(() => {
        repository = new InMemoryUsuarioRepository_1.InMemoryUsuarioRepository();
        useCase = new ListUsersUseCase_1.ListUsuariosUseCase(repository);
    });
    it('Sucesso: Deve listar todos os usuários cadastrados (alunos e outros perfis)', async () => {
        const aluno = UsuarioBuilder_1.UsuarioBuilder.umUsuario().comoAluno().build();
        const coordenador = UsuarioBuilder_1.UsuarioBuilder.umUsuario().comoCoordenador().build();
        await repository.save(aluno);
        await repository.save(coordenador);
        const resultado = await useCase.execute();
        expect(resultado).toHaveLength(2);
        const alunoEncontrado = resultado.find(u => u.id === aluno.id);
        expect(alunoEncontrado).toBeDefined();
        expect(alunoEncontrado?.email).toBe(aluno.email);
    });
    it('Falha: Deve retornar uma lista vazia se não houver usuários no banco', async () => {
        const resultado = await useCase.execute();
        expect(resultado).toEqual([]);
    });
});
