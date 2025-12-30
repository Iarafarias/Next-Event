import { CreateAlocarTutorAlunoDTO } from '../dtos/CreateAlocarTutorAlunoDTO';
import { AlocarTutorAlunoResponseDTO } from '../dtos/AlocarTutorAlunoResponseDTO';
import { IAlocarTutorAlunoRepository } from '../../../domain/alocarTutorAluno/repositories/IAlocarTutorAlunoRepository';

export class CreateAlocarTutorAlunoUseCase {
  constructor(private alocarTutorAlunoRepository: IAlocarTutorAlunoRepository) {}

  async execute(data: CreateAlocarTutorAlunoDTO): Promise<AlocarTutorAlunoResponseDTO> {
    return this.alocarTutorAlunoRepository.create(data);
  }
}
