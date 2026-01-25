import { CreateAlunoUseCase } from '../../../../src/application/aluno/use-cases/CreateAlunoUseCase';
import { IAlunoRepository } from '../../../../src/domain/aluno/repositories/IAlunoRepository';
import { ICursoRepository } from '../../../../src/domain/curso/repositories/ICursoRepository';
import { IUsuarioRepository } from '../../../../src/domain/user/repositories/IUsuarioRepository';
import { Aluno, TipoAcessoAluno } from '../../../../src/domain/aluno/entities/Aluno';
import { Curso } from '../../../../src/domain/curso/entities/Curso';
import { Usuario } from '../../../../src/domain/user/entities/Usuario';
import { beforeEach, describe, expect, jest, it } from '@jest/globals';

describe('CreateAlunoUseCase', () => {
  let createAlunoUseCase: CreateAlunoUseCase;
  let alunoRepositoryMock: jest.Mocked<IAlunoRepository>;
  let usuarioRepositoryMock: jest.Mocked<IUsuarioRepository>;
  let cursoRepositoryMock: jest.Mocked<ICursoRepository>;

  beforeEach(() => {
    alunoRepositoryMock = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUsuarioId: jest.fn(),
      findByMatricula: jest.fn(),
      findByCursoId: jest.fn(),
      findByTipoAcesso: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAlunosComAcessoTutor: jest.fn(),
      findAlunosComAcessoBolsista: jest.fn(),
    };

    usuarioRepositoryMock = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      listByRole: jest.fn(),
    };

    cursoRepositoryMock = {
      save: jest.fn(),
      findById: jest.fn(),
      findByCodigo: jest.fn(),
      findByNome: jest.fn(),
      findAll: jest.fn(),
      findAtivos: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    createAlunoUseCase = new CreateAlunoUseCase(
      alunoRepositoryMock,
      usuarioRepositoryMock,
      cursoRepositoryMock
    );
  });

  it('deve criar um aluno com sucesso', async () => {
    const alunoData = {
      usuarioId: 'user-123',
      cursoId: 'curso-123',
      matricula: '2024001',
      tipoAcesso: TipoAcessoAluno.ACESSO_TUTOR,
      anoIngresso: 2024,
      semestre: 1
    };

    const usuario = new Usuario({
      nome: 'João Silva',
      email: 'joao@email.com',
      senha: 'senha123',
      status: 'ATIVO'
    });
    usuario.id = 'user-123';

    const curso = Curso.create({
      nome: 'Engenharia de Software',
      codigo: 'ENG001',
      descricao: 'Curso de graduação'
    });

    usuarioRepositoryMock.findById.mockResolvedValue(usuario);
    cursoRepositoryMock.findById.mockResolvedValue(curso);
    alunoRepositoryMock.findByUsuarioId.mockResolvedValue(null);
    alunoRepositoryMock.findByMatricula.mockResolvedValue(null);

    // Act
    await createAlunoUseCase.execute(alunoData);

    // Assert
    expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith(alunoData.usuarioId);
    expect(cursoRepositoryMock.findById).toHaveBeenCalledWith(alunoData.cursoId);
    expect(alunoRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        usuarioId: alunoData.usuarioId,
        cursoId: alunoData.cursoId,
        matricula: alunoData.matricula,
        tipoAcesso: alunoData.tipoAcesso
      })
    );
  });

  it('deve lançar erro quando usuário não existe', async () => {
    // Arrange
    const alunoData = {
      usuarioId: 'user-inexistente',
      cursoId: 'curso-123',
      matricula: '2024001',
      tipoAcesso: TipoAcessoAluno.ACESSO_TUTOR
    };

    usuarioRepositoryMock.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(createAlunoUseCase.execute(alunoData)).rejects.toThrow('Usuário não encontrado');
    expect(alunoRepositoryMock.save).not.toHaveBeenCalled();
  });
});