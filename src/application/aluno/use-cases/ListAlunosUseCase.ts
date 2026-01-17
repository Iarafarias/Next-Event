import { IAlunoRepository } from '../../../domain/aluno/repositories/IAlunoRepository';
import { AlunoResponseDTO } from '../dtos/AlunoResponseDTO';

export class ListAlunosUseCase {
    constructor(private alunoRepository: IAlunoRepository) { }

    async execute(filters?: { cursoId?: string; role?: string }): Promise<AlunoResponseDTO[]> {
        return await this.alunoRepository.findAll(filters);
    }
}
