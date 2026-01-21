"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateAlunoUseCase_1 = require("../../../../src/application/aluno/use-cases/CreateAlunoUseCase");
const Aluno_1 = require("../../../../src/domain/aluno/entities/Aluno");
const Curso_1 = require("../../../../src/domain/curso/entities/Curso");
const Usuario_1 = require("../../../../src/domain/user/entities/Usuario");
describe('CreateAlunoUseCase', () => {
    let createAlunoUseCase;
    let alunoRepositoryMock;
    let usuarioRepositoryMock;
    let cursoRepositoryMock;
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
        createAlunoUseCase = new CreateAlunoUseCase_1.CreateAlunoUseCase(alunoRepositoryMock, usuarioRepositoryMock, cursoRepositoryMock);
    });
    it('deve criar um aluno com sucesso', async () => {
        // Arrange
        const alunoData = {
            usuarioId: 'user-123',
            cursoId: 'curso-123',
            matricula: '2024001',
            tipoAcesso: Aluno_1.TipoAcessoAluno.ACESSO_TUTOR,
            anoIngresso: 2024,
            semestre: 1
        };
        const usuario = new Usuario_1.Usuario({
            nome: 'João Silva',
            email: 'joao@email.com',
            senha: 'senha123',
            status: 'ATIVO'
        });
        usuario.id = 'user-123';
        const curso = Curso_1.Curso.create({
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
        expect(alunoRepositoryMock.save).toHaveBeenCalledWith(expect.objectContaining({
            usuarioId: alunoData.usuarioId,
            cursoId: alunoData.cursoId,
            matricula: alunoData.matricula,
            tipoAcesso: alunoData.tipoAcesso
        }));
    });
    it('deve lançar erro quando usuário não existe', async () => {
        // Arrange
        const alunoData = {
            usuarioId: 'user-inexistente',
            cursoId: 'curso-123',
            matricula: '2024001',
            tipoAcesso: Aluno_1.TipoAcessoAluno.ACESSO_TUTOR
        };
        usuarioRepositoryMock.findById.mockResolvedValue(null);
        // Act & Assert
        await expect(createAlunoUseCase.execute(alunoData)).rejects.toThrow('Usuário não encontrado');
        expect(alunoRepositoryMock.save).not.toHaveBeenCalled();
    });
});
