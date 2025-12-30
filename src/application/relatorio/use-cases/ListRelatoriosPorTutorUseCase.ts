import { IRelatorioRepository } from '../../../domain/relatorio/repositories/IRelatorioRepository';
import { RelatorioResponseDTO } from '../dtos/RelatorioResponseDTO';

export class ListRelatoriosPorTutorUseCase {
  constructor(private relatorioRepository: IRelatorioRepository) {}

  async execute(tutorId: string): Promise<RelatorioResponseDTO[]> {
    return this.relatorioRepository.listByTutor(tutorId);
  }
}
