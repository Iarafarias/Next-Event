import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CreateAlunoTutorUseCase } from '../../../../src/application/aluno/use-cases/CreateAlunoTutorUseCase';
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

describe('CreateAlunoTutorUseCase', () => {
    let useCase: CreateAlunoTutorUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        mockAlunoRepository.findByUsuarioId.mockReset();
        mockAlunoRepository.findByMatricula.mockReset();
        mockAlunoRepository.save.mockReset();
        mockUsuarioRepository.findById.mockReset();
        mockCursoRepository.findById.mockReset();

        useCase = new CreateAlunoTutorUseCase(
            mockAlunoRepository as any,
            mockUsuarioRepository as any,
            mockCursoRepository as any
        );
    });

    it('Deve criar um aluno tutor com sucesso', async () => {
        // Arrange
        mockUsuarioRepository.findById.mockResolvedValue({ id: 'user-tutor', tutor: true }); // É tutor
        mockCursoRepository.findById.mockResolvedValue({ id: 'curso-1' });
        mockAlunoRepository.findByUsuarioId.mockResolvedValue(null);
        mockAlunoRepository.findByMatricula.mockResolvedValue(null);

        // Act
        await useCase.execute({
            usuarioId: 'user-tutor',
            cursoId: 'curso-1',
            matricula: '2024999',
            anoIngresso: 2024,
            semestre: 1,
            tipoAcesso: TipoAcessoAluno.ACESSO_TUTOR
        });

        // Assert
        expect(mockAlunoRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            tipoAcesso: TipoAcessoAluno.ACESSO_TUTOR
        }));
    });

    it('Deve falhar se o usuário não tiver perfil de tutor', async () => {
        mockUsuarioRepository.findById.mockResolvedValue({ id: 'user-comum', tutor: false });

        await expect(useCase.execute({
            usuarioId: 'user-comum',
            cursoId: 'curso-1',
            matricula: '2024999',
            anoIngresso: 2024,
            semestre: 1,
            tipoAcesso: TipoAcessoAluno.ACESSO_TUTOR
        })).rejects.toThrow(/perfil de tutor/i);
    });
});