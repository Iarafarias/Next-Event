import { ICargaHorariaMinimaRepository } from '../../../domain/cargaHorariaMinima/repositories/ICargaHorariaMinimaRepository';
import { CreateCargaHorariaMinimaDTO } from '../dtos/CreateCargaHorariaMinimaDTO';
import { CargaHorariaMinimaResponseDTO } from '../dtos/CargaHorariaMinimaResponseDTO';

export class CreateCargaHorariaMinimaUseCase {
  constructor(private cargaHorariaMinimaRepository: ICargaHorariaMinimaRepository) {}

  async execute(data: CreateCargaHorariaMinimaDTO): Promise<CargaHorariaMinimaResponseDTO> {
    return this.cargaHorariaMinimaRepository.create(data);
  }
}
