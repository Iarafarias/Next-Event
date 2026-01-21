"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AtribuirPapelUseCase_1 = require("../../../../src/application/user/use-cases/AtribuirPapelUseCase");
const InMemoryUsuarioRepository_1 = require("./../../../builder/InMemoryUsuarioRepository");
const UsuarioBuilder_1 = require("../../../builder/UsuarioBuilder");
describe('AtribuirPapelUseCase', () => {
    let useCase;
    let repository;
    beforeEach(() => {
        repository = new InMemoryUsuarioRepository_1.InMemoryUsuarioRepository();
        useCase = new AtribuirPapelUseCase_1.AtribuirPapelUseCase(repository);
    });
    describe('AtribuirPapelUseCase - Casos de Sucesso e Falha', () => {
        //* Cobre os 3 papéis em um único bloco
        it.each([
            { papel: 'coordenador', campo: 'coordenador' },
            { papel: 'tutor', campo: 'tutor' },
            { papel: 'bolsista', campo: 'bolsista' }
        ])('Sucesso: Deve atribuir o papel de $papel', async ({ papel, campo }) => {
            const usuario = UsuarioBuilder_1.UsuarioBuilder.umUsuario().build();
            await repository.save(usuario);
            await useCase.execute(usuario.id, { papel: papel, acao: 'atribuir' });
            const atualizado = await repository.findById(usuario.id);
            expect(atualizado[campo]).toBeDefined();
            expect(atualizado[campo].id).toBeDefined();
        });
        it('Falha: Deve ignorar se o usuário não for encontrado', async () => {
            const idFake = crypto.randomUUID();
            await useCase.execute(idFake, { papel: 'tutor', acao: 'atribuir' });
            const lista = await repository.findAll();
            expect(lista.length).toBe(0);
        });
    });
    //TODO: Falta verificar se o usuário que solicitou a operação tem cargo suficiente para atribuir papel a algum outro usuário
});
