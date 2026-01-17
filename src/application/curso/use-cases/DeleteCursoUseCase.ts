import { ICursoRepository } from '../../../domain/curso/repositories/ICursoRepository';

export class DeleteCursoUseCase {
    constructor(private cursoRepository: ICursoRepository) { }

    async execute(id: string): Promise<void> {
        // Verificar se curso existe
        const curso = await this.cursoRepository.findById(id);
        if (!curso) throw new Error('Curso não encontrado');

        // Verificar se há alunos vinculados
        if (curso.alunosCount && curso.alunosCount > 0) {
            throw new Error('Não é possível deletar curso com alunos vinculados');
        }

        await this.cursoRepository.delete(id);
    }
}
