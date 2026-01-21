"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UpdateUserUseCase_1 = require("../../../../src/application/user/use-cases/UpdateUserUseCase");
const InMemoryUsuarioRepository_1 = require("./../../../builder/InMemoryUsuarioRepository");
const UsuarioBuilder_1 = require("../../../builder/UsuarioBuilder");
describe('UpdateUsuarioUseCase', () => {
    let useCase;
    let repository;
    beforeEach(() => {
        repository = new InMemoryUsuarioRepository_1.InMemoryUsuarioRepository();
        useCase = new UpdateUserUseCase_1.UpdateUsuarioUseCase(repository);
    });
    it('Sucesso: Deve atualizar os dados de um usuário', async () => {
        const usuarioOriginal = UsuarioBuilder_1.UsuarioBuilder.umUsuario().build();
        await repository.save(usuarioOriginal);
        const updateDTO = {
            id: usuarioOriginal.id,
            nome: 'Welington Atualizado'
        };
        const resultado = await useCase.execute(updateDTO);
        expect(resultado).not.toBeNull();
        expect(resultado?.nome).toBe('Welington Atualizado');
    });
    it('falha: Deve retornar null ao tentar atualizar usuário inexistente', async () => {
        const updateDTO = { id: 'id-inexistente', nome: 'Qualquer Nome' };
        const resultado = await useCase.execute(updateDTO);
        expect(resultado).toBeNull();
    });
});
