import { AlocarTutorAlunoResponseDTO } from '../dtos/AlocarTutorAlunoResponseDTO';
import { IAlocarTutorAlunoRepository } from '../../../domain/alocarTutorAluno/repositories/IAlocarTutorAlunoRepository';

export class ListAlocacoesTutorAlunoUseCase {
  constructor(private alocarTutorAlunoRepository: IAlocarTutorAlunoRepository) {}

  async execute(): Promise<AlocarTutorAlunoResponseDTO[]> {
    return this.alocarTutorAlunoRepository.list();
  }
}
