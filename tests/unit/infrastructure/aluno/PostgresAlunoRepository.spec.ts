import { PostgresAlunoRepository } from '../../../../src/infrastructure/aluno/repositories/PostgresAlunoRepository';
import { Aluno, TipoAcessoAluno } from '../../../../src/domain/aluno/entities/Aluno';
import { TestDataBuilder } from '../../../helpers/TestDataBuilder';
import { jest, describe, beforeEach,it,expect, } from '@jest/globals';

describe('PostgresAlunoRepository Unit Tests', () => {
  let repository: PostgresAlunoRepository;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      aluno: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    repository = new PostgresAlunoRepository();
    (repository as any).prisma = mockPrisma;
  });

  describe('save', () => {
    it('deve salvar um aluno no banco de dados', async () => {
      const aluno = TestDataBuilder.createAluno();
      mockPrisma.aluno.create.mockResolvedValue({});

      await repository.save(aluno);

      expect(mockPrisma.aluno.create).toHaveBeenCalledWith({
        data: {
          id: aluno.id,
          usuarioId: aluno.usuarioId,
          cursoId: aluno.cursoId,
          matricula: aluno.matricula,
          tipoAcesso: aluno.tipoAcesso,
          anoIngresso: aluno.anoIngresso,
          semestre: aluno.semestre,
          ativo: aluno.ativo,
          criadoEm: aluno.criadoEm,
          atualizadoEm: aluno.atualizadoEm,
        },
      });
    });
  });

  describe('findById', () => {
    it('deve retornar um aluno quando encontrado', async () => {
      const alunoId = 'aluno-123';
      const alunoData = {
        id: alunoId,
        usuarioId: 'user-123',
        cursoId: 'curso-123',
        matricula: '2024001',
        tipoAcesso: 'ACESSO_TUTOR',
        anoIngresso: 2024,
        semestre: 1,
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        usuario: {},
        curso: {},
      };

      mockPrisma.aluno.findUnique.mockResolvedValue(alunoData);

      const result = await repository.findById(alunoId);

      expect(result).toBeInstanceOf(Aluno);
      expect(result?.id).toBe(alunoId);
      expect(mockPrisma.aluno.findUnique).toHaveBeenCalledWith({
        where: { id: alunoId },
        include: {
          usuario: true,
          curso: true,
        },
      });
    });

    it('deve retornar null quando aluno não encontrado', async () => {
      const alunoId = 'aluno-inexistente';
      mockPrisma.aluno.findUnique.mockResolvedValue(null);

      const result = await repository.findById(alunoId);

      expect(result).toBeNull();
    });
  });

  describe('findByTipoAcesso', () => {
    it('deve retornar alunos do tipo especificado', async () => {
      const tipoAcesso = TipoAcessoAluno.ACESSO_TUTOR;
      const alunosData = [
        {
          id: 'aluno-1',
          usuarioId: 'user-1',
          cursoId: 'curso-1',
          matricula: '2024001',
          tipoAcesso: 'ACESSO_TUTOR',
          anoIngresso: 2024,
          semestre: 1,
          ativo: true,
          criadoEm: new Date(),
          atualizadoEm: new Date(),
          usuario: {},
          curso: {},
        },
      ];

      mockPrisma.aluno.findMany.mockResolvedValue(alunosData);

      const result = await repository.findByTipoAcesso(tipoAcesso);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Aluno);
      expect(mockPrisma.aluno.findMany).toHaveBeenCalledWith({
        where: { tipoAcesso },
        include: {
          usuario: true,
          curso: true,
        },
        orderBy: { matricula: 'asc' },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar os dados do aluno', async () => {
      const aluno = TestDataBuilder.createAluno({ id: 'aluno-123' });
      mockPrisma.aluno.update.mockResolvedValue({});

      await repository.update(aluno);

      expect(mockPrisma.aluno.update).toHaveBeenCalledWith({
        where: { id: aluno.id },
        data: {
          cursoId: aluno.cursoId,
          matricula: aluno.matricula,
          tipoAcesso: aluno.tipoAcesso,
          anoIngresso: aluno.anoIngresso,
          semestre: aluno.semestre,
          ativo: aluno.ativo,
          atualizadoEm: expect.any(Date),
        },
      });
    });
  });

  describe('delete', () => {
    it('deve deletar o aluno pelo ID', async () => {
      const alunoId = 'aluno-123';
      mockPrisma.aluno.delete.mockResolvedValue({});

      await repository.delete(alunoId);

      expect(mockPrisma.aluno.delete).toHaveBeenCalledWith({
        where: { id: alunoId },
      });
    });
  });
});
