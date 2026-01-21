"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GetUserByIdUseCase_1 = require("../../../../src/application/user/use-cases/GetUserByIdUseCase");
const InMemoryUsuarioRepository_1 = require("./../../../builder/InMemoryUsuarioRepository");
const UsuarioBuilder_1 = require("../../../builder/UsuarioBuilder");
describe('GetUserByIdUseCase', () => {
    let repository;
    let useCase;
    beforeEach(() => {
        repository = new InMemoryUsuarioRepository_1.InMemoryUsuarioRepository();
        useCase = new GetUserByIdUseCase_1.GetUsuarioByIdUseCase(repository);
    });
    it('Sucesso: Deve retornar um usuário quando um ID válido for fornecido', async () => {
        const usuario = UsuarioBuilder_1.UsuarioBuilder.umUsuario().build();
        await repository.save(usuario);
        const resultado = await useCase.execute(usuario.id);
        expect(resultado).toBeDefined();
        expect(resultado?.id).toBe(usuario.id);
        expect(resultado?.email).toBe(usuario.email);
    });
    it('Falha: Deve retornar undefined (ou null) quando o usuário não existir', async () => {
        const resultado = await useCase.execute('id-inexistente');
        expect(resultado).toBeFalsy();
    });
});
