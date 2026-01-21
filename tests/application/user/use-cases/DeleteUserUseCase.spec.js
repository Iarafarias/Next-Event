"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeleteUserUseCase_1 = require("../../../../src/application/user/use-cases/DeleteUserUseCase");
const InMemoryUsuarioRepository_1 = require("./../../../builder/InMemoryUsuarioRepository");
const UsuarioBuilder_1 = require("../../../builder/UsuarioBuilder");
describe('DeleteUsuarioUseCase', () => {
    let useCase;
    let repository;
    beforeEach(() => {
        repository = new InMemoryUsuarioRepository_1.InMemoryUsuarioRepository();
        useCase = new DeleteUserUseCase_1.DeleteUsuarioUseCase(repository);
    });
    it('Sucesso: Deve remover um usuário', async () => {
        const usuario = UsuarioBuilder_1.UsuarioBuilder.umUsuario().build();
        await repository.save(usuario);
        await useCase.execute(usuario.id);
        const encontrado = await repository.findById(usuario.id);
        expect(encontrado).toBeNull();
    });
    it('Falha: Deve retornar undefined (ou não lançar erro) ao tentar remover um usuário inexistente', async () => {
        const resultado = await useCase.execute('id-nao-existente');
        expect(resultado).toBeUndefined();
    });
});
