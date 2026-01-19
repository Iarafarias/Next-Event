import { AuthUsuarioUseCase } from '../../../../src/application/user/use-cases/AuthUserUseCase';
import { IUsuarioRepository } from '../../../../src/domain/user/repositories/IUsuarioRepository';
import { UsuarioBuilder } from '../../../builder/UsuarioBuilder';
import { AuthBuilder } from '../../../builder/AuthBuilder';
import { compare } from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthUserUseCase', () => {
  let sut: AuthUsuarioUseCase;
  let repository: jest.Mocked<IUsuarioRepository>;
  const mockedCompare = compare as jest.Mock;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    
    repository = { findByEmail: jest.fn() } as any;
    sut = new AuthUsuarioUseCase(repository);
    jest.clearAllMocks();
  });

  describe('AuthUserUseCase - Casos de sucesso', () => {
    const perfis = [
      { nome: 'Aluno', builder: () => UsuarioBuilder.umUsuario().comoAluno() },
      { nome: 'Coordenador', builder: () => UsuarioBuilder.umUsuario().comoCoordenador() },
      { nome: 'Tutor', builder: () => UsuarioBuilder.umUsuario().comoTutor() },
      { nome: 'Bolsista', builder: () => UsuarioBuilder.umUsuario().comoBolsista() },
    ];

    perfis.forEach(({ nome, builder }) => {
      it(`Sucesso: Deve autenticar um ${nome} com credenciais válidas`, async () => {
        const usuarioExistente = builder().build();
        const loginDTO = AuthBuilder.umaTentativa()
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
      const dto = AuthBuilder.umaTentativa().buildDTO();

      await expect(sut.execute(dto)).rejects.toThrow('Email ou senha incorretos');
    });

    it('Falha: Deve falhar se a senha estiver incorreta', async () => {
      const usuario = UsuarioBuilder.umUsuario().build();
      repository.findByEmail.mockResolvedValue(usuario);
      mockedCompare.mockResolvedValue(false);
      const dto = AuthBuilder.umaTentativa().comEmail(usuario.email).buildDTO();

      await expect(sut.execute(dto)).rejects.toThrow('Email ou senha incorretos');
    });

    it('Falha: Deve validar campos obrigatórios (Email)', async () => {
      const dto = AuthBuilder.umaTentativa().comEmail('').buildDTO();
      await expect(sut.execute(dto)).rejects.toThrow('Email ou senha incorretos');
    });

    it('Falha: Deve validar campos obrigatórios (Senha)', async () => {
      const dto = AuthBuilder.umaTentativa().comSenha('').buildDTO();
      await expect(sut.execute(dto)).rejects.toThrow('Email ou senha incorretos');
    });
  });
});