import { ICargaHorariaMinimaRepository } from '../../../domain/cargaHorariaMinima/repositories/ICargaHorariaMinimaRepository';

export class DeleteCargaHorariaMinimaUseCase {
  constructor(private cargaHorariaMinimaRepository: ICargaHorariaMinimaRepository) {}

  async execute(id: string): Promise<void> {
    await this.cargaHorariaMinimaRepository.delete(id);
  }
}
