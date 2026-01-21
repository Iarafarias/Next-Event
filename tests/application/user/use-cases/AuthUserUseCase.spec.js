"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthUserUseCase_1 = require("../../../../src/application/user/use-cases/AuthUserUseCase");
const UsuarioBuilder_1 = require("../../../builder/UsuarioBuilder");
const AuthBuilder_1 = require("../../../builder/AuthBuilder");
const bcryptjs_1 = require("bcryptjs");
jest.mock('bcryptjs');
describe('AuthUserUseCase', () => {
    let sut;
    let repository;
    const mockedCompare = bcryptjs_1.compare;
    beforeEach(() => {
        process.env.JWT_SECRET = 'test-secret';
        repository = { findByEmail: jest.fn() };
        sut = new AuthUserUseCase_1.AuthUsuarioUseCase(repository);
        jest.clearAllMocks();
    });
    describe('AuthUserUseCase - Casos de sucesso', () => {
        const perfis = [
            { nome: 'Aluno', builder: () => UsuarioBuilder_1.UsuarioBuilder.umUsuario().comoAluno() },
            { nome: 'Coordenador', builder: () => UsuarioBuilder_1.UsuarioBuilder.umUsuario().comoCoordenador() },
            { nome: 'Tutor', builder: () => UsuarioBuilder_1.UsuarioBuilder.umUsuario().comoTutor() },
            { nome: 'Bolsista', builder: () => UsuarioBuilder_1.UsuarioBuilder.umUsuario().comoBolsista() },
        ];
        perfis.forEach(({ nome, builder }) => {
            it(`Sucesso: Deve autenticar um ${nome} com credenciais válidas`, async () => {
                const usuarioExistente = builder().build();
                const loginDTO = AuthBuilder_1.AuthBuilder.umaTentativa()
                    .comEmail(usuarioExistente.email)
                    .comSenha('senha_valida')
                    .buildDTO();
                repository.findByEmail.mockResolvedValue(usuarioExistente);
                mockedCompare.mockResolvedValue(true);
                const result = await sut.execute(loginDTO);
                expect(result).toHaveProperty('token');
                expect(result.usuario.email).toBe(usuarioExistente.email);
            });
        });
    });
    describe('AuthUserUseCase - Casos de falha', () => {
        it('Falha: Deve falhar se o e-mail não existir', async () => {
            repository.findByEmail.mockResolvedValue(null);
            const dto = AuthBuilder_1.AuthBuilder.umaTentativa().buildDTO();
            await expect(sut.execute(dto)).rejects.toThrow('Email ou senha incorretos');
        });
        it('Falha: Deve falhar se a senha estiver incorreta', async () => {
            const usuario = UsuarioBuilder_1.UsuarioBuilder.umUsuario().build();
            repository.findByEmail.mockResolvedValue(usuario);
            mockedCompare.mockResolvedValue(false);
            const dto = AuthBuilder_1.AuthBuilder.umaTentativa().comEmail(usuario.email).buildDTO();
            await expect(sut.execute(dto)).rejects.toThrow('Email ou senha incorretos');
        });
        it('Falha: Deve validar campos obrigatórios (Email)', async () => {
            const dto = AuthBuilder_1.AuthBuilder.umaTentativa().comEmail('').buildDTO();
            await expect(sut.execute(dto)).rejects.toThrow('Email ou senha incorretos');
        });
        it('Falha: Deve validar campos obrigatórios (Senha)', async () => {
            const dto = AuthBuilder_1.AuthBuilder.umaTentativa().comSenha('').buildDTO();
            await expect(sut.execute(dto)).rejects.toThrow('Email ou senha incorretos');
        });
    });
});
