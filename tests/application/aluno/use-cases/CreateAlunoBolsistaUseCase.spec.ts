import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CreateAlunoBolsistaUseCase } from '../../../../src/application/aluno/use-cases/CreateAlunoBolsistaUseCase';
import { TipoAcessoAluno } from '../../../../src/domain/aluno/entities/Aluno';

const mockAlunoRepository = {
    findByUsuarioId: jest.fn<any>(),
    findByMatricula: jest.fn<any>(),
    save: jest.fn<any>()
};

const mockUsuarioRepository = {
    findById: jest.fn<any>()
};

const mockCursoRepository = {
    findById: jest.fn<any>()
};

describe('CreateAlunoBolsistaUseCase', () => {
    let useCase: CreateAlunoBolsistaUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        // Reiniciando os mocks com valores padrão para evitar poluição entre testes
        mockAlunoRepository.findByUsuarioId.mockReset();
        mockAlunoRepository.findByMatricula.mockReset();
        mockAlunoRepository.save.mockReset();
        mockUsuarioRepository.findById.mockReset();
        mockCursoRepository.findById.mockReset();

        useCase = new CreateAlunoBolsistaUseCase(
            mockAlunoRepository as any,
            mockUsuarioRepository as any,
            mockCursoRepository as any
        );
    });

    it('Deve criar um aluno bolsista com sucesso', async () => {
        // Arrange
        mockUsuarioRepository.findById.mockResolvedValue({ id: 'user-1', bolsista: true }); // É bolsista
        mockCursoRepository.findById.mockResolvedValue({ id: 'curso-1' });
        mockAlunoRepository.findByUsuarioId.mockResolvedValue(null); // Não é aluno ainda
        mockAlunoRepository.findByMatricula.mockResolvedValue(null); // Matrícula livre

        // Act
        await useCase.execute({
            usuarioId: 'user-1',
            cursoId: 'curso-1',
            matricula: '2024001',
            anoIngresso: 2024,
            semestre: 1,
            // Adicionado 'tipoAcesso' para satisfazer o DTO, mesmo que o UseCase force BOLSISTA internamente
            tipoAcesso: TipoAcessoAluno.ACESSO_BOLSISTA 
        });

        // Assert
        expect(mockAlunoRepository.save).toHaveBeenCalled();
        expect(mockAlunoRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            tipoAcesso: TipoAcessoAluno.ACESSO_BOLSISTA
        }));
    });

    it('Deve falhar se o usuário não tiver perfil de bolsista', async () => {
        mockUsuarioRepository.findById.mockResolvedValue({ id: 'user-1', bolsista: false }); // NÃO é bolsista

        await expect(useCase.execute({
            usuarioId: 'user-1',
            cursoId: 'curso-1',
            matricula: '2024001',
            anoIngresso: 2024,
            semestre: 1,
            tipoAcesso: TipoAcessoAluno.ACESSO_BOLSISTA
        })).rejects.toThrow('Usuário deve ter perfil de bolsista');
    });

    it('Deve falhar se o usuário já for aluno', async () => {
        mockUsuarioRepository.findById.mockResolvedValue({ id: 'user-1', bolsista: true });
        mockCursoRepository.findById.mockResolvedValue({ id: 'curso-1' });
        mockAlunoRepository.findByUsuarioId.mockResolvedValue({ id: 'aluno-existente' });

        await expect(useCase.execute({
            usuarioId: 'user-1',
            cursoId: 'curso-1',
            matricula: '2024001',
            anoIngresso: 2024,
            semestre: 1,
            tipoAcesso: TipoAcessoAluno.ACESSO_BOLSISTA
        })).rejects.toThrow('Usuário já possui perfil de aluno');
    });
});