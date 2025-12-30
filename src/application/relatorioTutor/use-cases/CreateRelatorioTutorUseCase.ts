import { CreateRelatorioTutorDTO } from '../dtos/CreateRelatorioTutorDTO';
import { RelatorioTutorResponseDTO } from '../dtos/RelatorioTutorResponseDTO';
import { IRelatorioTutorRepository } from '../../../domain/relatorioTutor/repositories/IRelatorioTutorRepository';

export class CreateRelatorioTutorUseCase {
  constructor(private relatorioTutorRepository: IRelatorioTutorRepository) {}

  async execute(data: CreateRelatorioTutorDTO): Promise<RelatorioTutorResponseDTO> {
    return this.relatorioTutorRepository.create(data);
  }
}
