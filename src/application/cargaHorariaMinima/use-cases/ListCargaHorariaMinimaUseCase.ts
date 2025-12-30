import { ICargaHorariaMinimaRepository } from '../../../domain/cargaHorariaMinima/repositories/ICargaHorariaMinimaRepository';
import { CargaHorariaMinimaResponseDTO } from '../dtos/CargaHorariaMinimaResponseDTO';

export class ListCargaHorariaMinimaUseCase {
  constructor(private cargaHorariaMinimaRepository: ICargaHorariaMinimaRepository) {}

  async execute(): Promise<CargaHorariaMinimaResponseDTO[]> {
    return this.cargaHorariaMinimaRepository.list();
  }
}
