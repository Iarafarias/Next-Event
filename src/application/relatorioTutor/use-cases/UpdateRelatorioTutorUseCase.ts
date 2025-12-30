import { UpdateRelatorioTutorDTO } from '../dtos/UpdateRelatorioTutorDTO';
import { RelatorioTutorResponseDTO } from '../dtos/RelatorioTutorResponseDTO';
import { IRelatorioTutorRepository } from '../../../domain/relatorioTutor/repositories/IRelatorioTutorRepository';

export class UpdateRelatorioTutorUseCase {
  constructor(private relatorioTutorRepository: IRelatorioTutorRepository) {}

  async execute(id: string, data: UpdateRelatorioTutorDTO): Promise<RelatorioTutorResponseDTO | null> {
    return this.relatorioTutorRepository.update(id, data);
  }
}
