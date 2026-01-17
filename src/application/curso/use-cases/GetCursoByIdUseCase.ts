import { ICursoRepository } from '../../../domain/curso/repositories/ICursoRepository';
import { CursoResponseDTO } from '../dtos/CursoResponseDTO';

export class GetCursoByIdUseCase {
    constructor(private cursoRepository: ICursoRepository) { }

    async execute(id: string): Promise<CursoResponseDTO> {
        const curso = await this.cursoRepository.findById(id);
        if (!curso) throw new Error('Curso não encontrado');

        return curso;
    }
}
