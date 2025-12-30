import { RelatorioTutorResponseDTO } from '../dtos/RelatorioTutorResponseDTO';
import { IRelatorioTutorRepository } from '../../../domain/relatorioTutor/repositories/IRelatorioTutorRepository';

export class ListRelatorioTutoresUseCase {
  constructor(private relatorioTutorRepository: IRelatorioTutorRepository) {}

  async execute(): Promise<RelatorioTutorResponseDTO[]> {
    return this.relatorioTutorRepository.list();
  }
}
