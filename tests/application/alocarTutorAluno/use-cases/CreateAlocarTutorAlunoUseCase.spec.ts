import { describe, it, expect, beforeEach } from '@jest/globals';
import { InMemoryAlocarTutorAlunoRepository } from '../../../builder/InMemoryAlocarTutorAlunoRepository';
import { CreateAlocarTutorAlunoUseCase } from '../../../../src/application/alocarTutorAluno/use-cases/CreateAlocarTutorAlunoUseCase';

describe('CreateAlocarTutorAlunoUseCase', () => {
    let useCase: CreateAlocarTutorAlunoUseCase;
    let repository: InMemoryAlocarTutorAlunoRepository;

    beforeEach(() => {
        repository = new InMemoryAlocarTutorAlunoRepository();
        useCase = new CreateAlocarTutorAlunoUseCase(repository);
    });

    it('Deve alocar um bolsista a um tutor com sucesso', async () => {
        const input = {
            tutorId: 'tutor-123',
            bolsistaId: 'bolsista-456',
            periodoId: 'periodo-2024',
            dataInicio: new Date()
        };

        await useCase.execute(input);

        const alocacoes = await repository.findByTutorId('tutor-123');
        expect(alocacoes).toHaveLength(1);
        expect(alocacoes[0].bolsistaId).toBe('bolsista-456');
    });
});