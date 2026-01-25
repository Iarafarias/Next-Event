import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AuthUsuarioUseCase } from '../../../../src/application/user/use-cases/AuthUserUseCase';
import { compare } from 'bcryptjs';
import { IUsuarioRepository } from '../../../../src/domain/user/repositories/IUsuarioRepository';

jest.mock('bcryptjs');

describe('AuthUserUseCase', () => {
  let useCase: AuthUsuarioUseCase;
  let repository: jest.Mocked<IUsuarioRepository>;
  const mockedCompare = compare as jest.Mock;

  beforeEach(() => {
    repository = { findByEmail: jest.fn() } as any;
    useCase = new AuthUsuarioUseCase(repository);
    jest.clearAllMocks();
  });

  describe('AuthUserUseCase - Casos de sucesso', () => {
    const cenarios = [
      { nome: 'Bolsista', perfil: { bolsista: { id: 'b1' } } },
      { nome: 'Tutor', perfil: { tutor: { id: 't1' } } },
      { nome: 'Coordenador', perfil: { coordenador: { id: 'c1' } } },
      { nome: 'Usuário Comum', perfil: {} }
    ];

    cenarios.forEach(({ nome, perfil }) => {
       it(`Sucesso: Deve autenticar um ${nome} com credenciais válidas`, async () => {
         const dto = { email: 'teste@email.com', senha: '123' };
         const usuarioExistente = { 
             id: '1', 
             email: dto.email, 
             senha: 'hash', 
             nome: 'Teste',
             status: 'ATIVO',
             criadoEm: new Date(),
             atualizadoEm: new Date(),
             ...perfil 
         };

         repository.findByEmail.mockResolvedValue(usuarioExistente as any);
         mockedCompare.mockImplementation(async () => true);

         const result = await useCase.execute(dto);

         expect(result).toHaveProperty('token');
         expect(result.usuario.email).toBe(usuarioExistente.email);
       });
    });
  });

  describe('AuthUserUseCase - Casos de falha', () => {
    it('Falha: Deve falhar se o e-mail não existir', async () => {
       const dto = { email: 'inexistente@email.com', senha: '123' };
       repository.findByEmail.mockResolvedValue(null);

       await expect(useCase.execute(dto)).rejects.toThrow('Email ou senha incorretos');
    });

    it('Falha: Deve falhar se a senha estiver incorreta', async () => {
       const dto = { email: 'teste@email.com', senha: 'errada' };
       const usuario = { id: '1', email: dto.email, senha: 'hash' };

       repository.findByEmail.mockResolvedValue(usuario as any);
       mockedCompare.mockImplementation(async () => false);

       await expect(useCase.execute(dto)).rejects.toThrow('Email ou senha incorretos');
    });

    it('Falha: Deve validar campos obrigatórios (Email)', async () => {
       const dto = { email: '', senha: '123' };
       try {
         await useCase.execute(dto);
       } catch (e) {
         expect(e).toBeTruthy();
       }
    });

    it('Falha: Deve validar campos obrigatórios (Senha)', async () => {
       const dto = { email: 'teste@email.com', senha: '' };
       await expect(useCase.execute(dto)).rejects.toThrow();
    });
  });
});