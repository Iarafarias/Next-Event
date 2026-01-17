import { IAlunoRepository } from '../../../domain/aluno/repositories/IAlunoRepository';
import { AlunoResponseDTO } from '../dtos/AlunoResponseDTO';

export class GetAlunoByIdUseCase {
    constructor(private alunoRepository: IAlunoRepository) { }

    async execute(id: string): Promise<AlunoResponseDTO> {
        const aluno = await this.alunoRepository.findById(id);
        if (!aluno) throw new Error('Aluno não encontrado');

        return aluno;
    }
}
