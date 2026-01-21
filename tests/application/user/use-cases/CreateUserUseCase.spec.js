"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateUserUseCase_1 = require("../../../../src/application/user/use-cases/CreateUserUseCase");
const UsuarioBuilder_1 = require("../../../builder/UsuarioBuilder");
describe('CreateUsuarioUseCase', () => {
    let sut;
    let repository;
    beforeEach(() => {
        repository = { findByEmail: jest.fn(), create: jest.fn() };
        sut = new CreateUserUseCase_1.CreateUsuarioUseCase(repository);
        repository.findByEmail.mockResolvedValue(null);
        repository.create.mockImplementation(async (u) => u);
    });
    describe('CreateUserUseCase - Casos de sucesso', () => {
        it('Sucesso: Deve cadastrar um Coordenador', async () => {
            const dto = UsuarioBuilder_1.UsuarioBuilder.umUsuario().comoCoordenador().buildDTO();
            const result = await sut.execute(dto);
            expect(result.usuario.coordenador).toBeDefined();
        });
        it('Sucesso: Deve cadastrar um Tutor', async () => {
            const dto = UsuarioBuilder_1.UsuarioBuilder.umUsuario().comoTutor().buildDTO();
            const result = await sut.execute(dto);
            expect(result.usuario.tutor).toBeDefined();
        });
        it('Sucesso: Deve cadastrar um Bolsista', async () => {
            const dto = UsuarioBuilder_1.UsuarioBuilder.umUsuario().comoBolsista().buildDTO();
            const result = await sut.execute(dto);
            expect(result.usuario.bolsista).toBeDefined();
        });
        it('Sucesso: Deve cadastrar um Aluno(sem perfis adicionais)', async () => {
            const dto = UsuarioBuilder_1.UsuarioBuilder.umUsuario().comoAluno().buildDTO();
            repository.findByEmail.mockResolvedValue(null);
            repository.create.mockImplementation(async (u) => u);
            const result = await sut.execute(dto);
            expect(result.usuario.id).toBeDefined();
            expect(result.usuario.coordenador).toBeUndefined();
            expect(result.usuario.tutor).toBeUndefined();
            expect(result.usuario.bolsista).toBeUndefined();
        });
    });
    describe('CreateUserUseCase - Casos de falha', () => {
        it('Falha: Deve falhar ao cadastrar email já existente', async () => {
            const dto = UsuarioBuilder_1.UsuarioBuilder.umUsuario().buildDTO();
            repository.findByEmail.mockResolvedValue({ id: 'existente' });
            await expect(sut.execute(dto)).rejects.toThrow('Usuário já existe');
        });
        it('Falha: Deve falhar se o nome não for fornecido', async () => {
            const dto = UsuarioBuilder_1.UsuarioBuilder.umUsuario().semNome().buildDTO();
            await expect(sut.execute(dto)).rejects.toThrow('Nome é obrigatório');
        });
        it('Falha: Deve falhar se o email não for fornecido', async () => {
            const dto = UsuarioBuilder_1.UsuarioBuilder.umUsuario().semEmail().buildDTO();
            await expect(sut.execute(dto)).rejects.toThrow('Email é obrigatório');
        });
        it('Falha: Deve falhar se a senha não for fornecida', async () => {
            const dto = UsuarioBuilder_1.UsuarioBuilder.umUsuario().semSenha().buildDTO();
            await expect(sut.execute(dto)).rejects.toThrow('Senha é obrigatória');
        });
    });
});
