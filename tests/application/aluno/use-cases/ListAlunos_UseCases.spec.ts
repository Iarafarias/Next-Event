import { describe, it, expect, beforeEach } from '@jest/globals';
import { InMemoryAlunoRepository } from '../../../builder/InMemoryAlunoRepository';
import { ListAlunosUseCase } from '../../../../src/application/aluno/use-cases/ListAlunosUseCase';
import { ListAlunosBolsistasUseCase } from '../../../../src/application/aluno/use-cases/ListAlunosBolsistasUseCase';
import { ListAlunosTutoresUseCase } from '../../../../src/application/aluno/use-cases/ListAlunosTutoresUseCase';
import { TipoAcessoAluno } from '../../../../src/domain/aluno/entities/Aluno';

describe('Aluno - Casos de Uso de Listagem', () => {
    let repository: InMemoryAlunoRepository;
    let listAll: ListAlunosUseCase;
    let listBolsistas: ListAlunosBolsistasUseCase;
    let listTutores: ListAlunosTutoresUseCase;

    beforeEach(() => {
        repository = new InMemoryAlunoRepository();
        listAll = new ListAlunosUseCase(repository);
        listBolsistas = new ListAlunosBolsistasUseCase(repository);
        listTutores = new ListAlunosTutoresUseCase(repository);
    });

    it('Deve listar todos os alunos', async () => {
        await repository.save({ id: '1', usuarioId: 'u1', tipoAcesso: 'ALUNO' } as any);
        await repository.save({ id: '2', usuarioId: 'u2', tipoAcesso: 'BOLSISTA' } as any);
        
        const result = await listAll.execute();
        expect(result).toHaveLength(2);
    });

    it('Deve listar apenas alunos bolsistas', async () => {
        // Arrange
        await repository.save({ id: 'aluno-comum', tipoAcesso: 'ALUNO' } as any);
        await repository.save({ 
            id: 'aluno-bolsista', 
            // Usa o Enum real ou a string esperada
            tipoAcesso: TipoAcessoAluno.ACESSO_BOLSISTA 
        } as any);
        
        // Act
        const result = await listBolsistas.execute();
        
        // Assert
        expect(result).toHaveLength(1);
        // Validamos pelo ID para evitar erros de propriedade indefinida (nome)
        expect(result[0].id).toBe('aluno-bolsista');
    });

    it('Deve listar apenas alunos tutores', async () => {
        // Arrange
        await repository.save({ id: 'aluno-comum', tipoAcesso: 'ALUNO' } as any);
        await repository.save({ 
            id: 'aluno-tutor', 
            tipoAcesso: TipoAcessoAluno.ACESSO_TUTOR 
        } as any);
        
        // Act
        const result = await listTutores.execute();
        
        // Assert
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('aluno-tutor');
    });
});