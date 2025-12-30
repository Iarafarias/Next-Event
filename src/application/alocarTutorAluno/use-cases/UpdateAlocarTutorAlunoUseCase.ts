import { UpdateAlocarTutorAlunoDTO } from '../dtos/UpdateAlocarTutorAlunoDTO';
import { AlocarTutorAlunoResponseDTO } from '../dtos/AlocarTutorAlunoResponseDTO';
import { IAlocarTutorAlunoRepository } from '../../../domain/alocarTutorAluno/repositories/IAlocarTutorAlunoRepository';

export class UpdateAlocarTutorAlunoUseCase {
  constructor(private alocarTutorAlunoRepository: IAlocarTutorAlunoRepository) {}

  async execute(id: string, data: UpdateAlocarTutorAlunoDTO): Promise<AlocarTutorAlunoResponseDTO | null> {
    return this.alocarTutorAlunoRepository.update(id, data);
  }
}
