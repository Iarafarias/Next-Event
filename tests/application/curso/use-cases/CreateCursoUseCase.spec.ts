import { CreateCursoUseCase } from '../../../../src/application/curso/use-cases/CreateCursoUseCase';
import { ICursoRepository } from '../../../../src/domain/curso/repositories/ICursoRepository';
import { Curso } from '../../../../src/domain/curso/entities/Curso';
import { beforeEach, describe, expect, jest, it } from '@jest/globals';

describe('CreateCursoUseCase', () => {
  let createCursoUseCase: CreateCursoUseCase;
  let cursoRepositoryMock: jest.Mocked<ICursoRepository>;

  beforeEach(() => {
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
    createCursoUseCase = new CreateCursoUseCase(cursoRepositoryMock);
  });

  it('deve criar um curso com sucesso', async () => {
    // Arrange
    const cursoData = {
      nome: 'Engenharia de Software',
      codigo: 'ENG001',
      descricao: 'Curso de graduação em engenharia de software',
      ativo: true
    };

    cursoRepositoryMock.findByCodigo.mockResolvedValue(null);

    // Act
    await createCursoUseCase.execute(cursoData);

    // Assert
    expect(cursoRepositoryMock.findByCodigo).toHaveBeenCalledWith(cursoData.codigo);
    expect(cursoRepositoryMock.save).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: cursoData.nome,
        codigo: cursoData.codigo,
        descricao: cursoData.descricao,
        ativo: cursoData.ativo
      })
    );
  });

  it('deve lançar erro quando código já existe', async () => {
    // Arrange
    const cursoData = {
      nome: 'Engenharia de Software',
      codigo: 'ENG001',
      descricao: 'Curso de graduação em engenharia de software'
    };

    const cursoExistente = Curso.create({
      nome: 'Curso Existente',
      codigo: 'ENG001',
      descricao: 'Curso já cadastrado'
    });

    cursoRepositoryMock.findByCodigo.mockResolvedValue(cursoExistente);

    // Act & Assert
    await expect(createCursoUseCase.execute(cursoData)).rejects.toThrow('Código do curso já cadastrado');
    expect(cursoRepositoryMock.save).not.toHaveBeenCalled();
  });
});