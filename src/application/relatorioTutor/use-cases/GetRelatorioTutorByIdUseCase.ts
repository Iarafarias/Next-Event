import { RelatorioTutorResponseDTO } from '../dtos/RelatorioTutorResponseDTO';
import { IRelatorioTutorRepository } from '../../../domain/relatorioTutor/repositories/IRelatorioTutorRepository';

export class GetRelatorioTutorByIdUseCase {
  constructor(private relatorioTutorRepository: IRelatorioTutorRepository) {}

  async execute(id: string): Promise<RelatorioTutorResponseDTO | null> {
    return this.relatorioTutorRepository.getById(id);
  }
}
