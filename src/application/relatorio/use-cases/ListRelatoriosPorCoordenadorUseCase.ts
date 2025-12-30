import { IRelatorioRepository } from '../../../domain/relatorio/repositories/IRelatorioRepository';
import { RelatorioResponseDTO } from '../dtos/RelatorioResponseDTO';

export class ListRelatoriosPorCoordenadorUseCase {
  constructor(private relatorioRepository: IRelatorioRepository) {}

  async execute(coordenadorId: string): Promise<RelatorioResponseDTO[]> {
    return this.relatorioRepository.listByCoordenador(coordenadorId);
  }
}
