import { AlocarTutorAlunoResponseDTO } from '../dtos/AlocarTutorAlunoResponseDTO';
import { IAlocarTutorAlunoRepository } from '../../../domain/alocarTutorAluno/repositories/IAlocarTutorAlunoRepository';

export class ListAlocacoesTutorAlunoUseCase {
  constructor(private alocarTutorAlunoRepository: IAlocarTutorAlunoRepository) { }

  async execute(filters?: { tutorId?: string; bolsistaId?: string; periodoId?: string }): Promise<AlocarTutorAlunoResponseDTO[]> {
    return this.alocarTutorAlunoRepository.list(filters);
  }

}
