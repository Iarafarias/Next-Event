import { ICargaHorariaMinimaRepository } from '../../../domain/cargaHorariaMinima/repositories/ICargaHorariaMinimaRepository';
import { CargaHorariaMinimaResponseDTO } from '../dtos/CargaHorariaMinimaResponseDTO';

export class ListCargaHorariaMinimaUseCase {
  constructor(private cargaHorariaMinimaRepository: ICargaHorariaMinimaRepository) { }

  async execute(periodoId?: string): Promise<CargaHorariaMinimaResponseDTO[]> {
    return this.cargaHorariaMinimaRepository.list(periodoId);
  }

}
