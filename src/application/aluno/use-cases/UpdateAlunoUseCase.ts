import { IAlunoRepository } from '../../../domain/aluno/repositories/IAlunoRepository';
import { UpdateAlunoDTO } from '../dtos/UpdateAlunoDTO';
import { AlunoResponseDTO } from '../dtos/AlunoResponseDTO';

export class UpdateAlunoUseCase {
    constructor(private alunoRepository: IAlunoRepository) { }

    async execute(data: UpdateAlunoDTO): Promise<AlunoResponseDTO> {
        // Verificar se aluno existe
        const alunoExists = await this.alunoRepository.findById(data.id);
        if (!alunoExists) throw new Error('Aluno não encontrado');

        const updated = await this.alunoRepository.update(data);
        if (!updated) throw new Error('Erro ao atualizar aluno');

        return updated;
    }
}
