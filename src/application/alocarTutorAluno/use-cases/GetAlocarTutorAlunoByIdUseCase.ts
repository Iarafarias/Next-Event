import { AlocarTutorAlunoResponseDTO } from '../dtos/AlocarTutorAlunoResponseDTO';
import { IAlocarTutorAlunoRepository } from '../../../domain/alocarTutorAluno/repositories/IAlocarTutorAlunoRepository';

export class GetAlocarTutorAlunoByIdUseCase {
  constructor(private alocarTutorAlunoRepository: IAlocarTutorAlunoRepository) {}

  async execute(id: string): Promise<AlocarTutorAlunoResponseDTO | null> {
    return this.alocarTutorAlunoRepository.getById(id);
  }
}
