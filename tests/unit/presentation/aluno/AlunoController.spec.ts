import { AlunoController } from '../../../../src/presentation/aluno/controllers/AlunoController';
import { ExpressMocks, TestDataBuilder } from '../../../helpers/TestDataBuilder';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';

describe('AlunoController Unit Tests', () => {
  let alunoController: AlunoController;
  let mockCreateAlunoUseCase: any;
  let mockListAlunosUseCase: any;
  let mockListAlunosTutoresUseCase: any;
  let mockListAlunosBolsistasUseCase: any;

  beforeEach(() => {
    mockCreateAlunoUseCase = {
      execute: jest.fn(),
    };

    mockListAlunosUseCase = {
      execute: jest.fn(),
    };

    mockListAlunosTutoresUseCase = {
      execute: jest.fn(),
    };

    mockListAlunosBolsistasUseCase = {
      execute: jest.fn(),
    };

    alunoController = new AlunoController(
      mockCreateAlunoUseCase,
      mockListAlunosUseCase,
      mockListAlunosTutoresUseCase,
      mockListAlunosBolsistasUseCase
    );
  });

  describe('create', () => {
    it('deve criar um aluno com sucesso', async () => {
      const req = ExpressMocks.createMockRequest({
        body: {
          usuarioId: 'user-123',
          cursoId: 'curso-123',
          matricula: '2024001',
          tipo: 'ACESSO_TUTOR',
          anoIngresso: 2024,
          semestre: 1,
        },
      });
      const res = ExpressMocks.createMockResponse();

      const aluno = TestDataBuilder.createAluno();
      mockCreateAlunoUseCase.execute.mockResolvedValue(aluno);

      await alunoController.create(req, res);

      expect(mockCreateAlunoUseCase.execute).toHaveBeenCalledWith({
        usuarioId: 'user-123',
        cursoId: 'curso-123',
        matricula: '2024001',
        tipoAcesso: 'ACESSO_TUTOR',
        anoIngresso: 2024,
        semestre: 1,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Aluno criado com sucesso' });
    });

    it('deve retornar erro 400 quando campos obrigatórios estão ausentes', async () => {
      const req = ExpressMocks.createMockRequest({
        body: {
          usuarioId: 'user-123',
          // cursoId, matricula e tipo ausentes
        },
      });
      const res = ExpressMocks.createMockResponse();

      await alunoController.create(req, res);

      expect(mockCreateAlunoUseCase.execute).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Campos obrigatórios: usuarioId, cursoId, matricula, tipo',
      });
    });

    it('deve tratar erros do use case', async () => {
      const req = ExpressMocks.createMockRequest({
        body: {
          usuarioId: 'user-123',
          cursoId: 'curso-123',
          matricula: '2024001',
          tipo: 'ACESSO_TUTOR',
        },
      });
      const res = ExpressMocks.createMockResponse();

      const error = new Error('Usuário não encontrado');
      mockCreateAlunoUseCase.execute.mockRejectedValue(error);

      await alunoController.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Usuário não encontrado',
      });
    });
  });

  describe('list', () => {
    it('deve listar todos os alunos', async () => {
      const req = ExpressMocks.createMockRequest();
      const res = ExpressMocks.createMockResponse();

      const alunos = [TestDataBuilder.createAluno(), TestDataBuilder.createAluno()];
      mockListAlunosUseCase.execute.mockResolvedValue(alunos);

      await alunoController.list(req, res);

      expect(mockListAlunosUseCase.execute).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(alunos);
    });

    it('deve tratar erros na listagem', async () => {
      const req = ExpressMocks.createMockRequest();
      const res = ExpressMocks.createMockResponse();

      const error = new Error('Erro de banco de dados');
      mockListAlunosUseCase.execute.mockRejectedValue(error);

      await alunoController.list(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor',
      });
    });
  });

  describe('listWithAccessTutor', () => {
    it('deve listar alunos com acesso tutor', async () => {
      const req = ExpressMocks.createMockRequest();
      const res = ExpressMocks.createMockResponse();

      const alunos = [TestDataBuilder.createAluno({ tipoAcesso: 'ACESSO_TUTOR' })];
      mockListAlunosTutoresUseCase.execute.mockResolvedValue(alunos);

      await alunoController.listTutores(req, res);

      expect(mockListAlunosTutoresUseCase.execute).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(alunos);
    });
  });

  describe('listWithAccessBolsista', () => {
    it('deve listar alunos com acesso bolsista', async () => {
      const req = ExpressMocks.createMockRequest();
      const res = ExpressMocks.createMockResponse();

      const alunos = [TestDataBuilder.createAluno({ tipoAcesso: 'ACESSO_BOLSISTA' })];
      mockListAlunosBolsistasUseCase.execute.mockResolvedValue(alunos);

      await alunoController.listBolsistas(req, res);

      expect(mockListAlunosBolsistasUseCase.execute).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(alunos);
    });
  });
});
