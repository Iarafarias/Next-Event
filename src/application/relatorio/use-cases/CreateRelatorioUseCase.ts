import { CreateRelatorioDTO } from '../dtos/CreateRelatorioDTO';
import { RelatorioResponseDTO } from '../dtos/RelatorioResponseDTO';
import { IRelatorioRepository } from '../../../domain/relatorio/repositories/IRelatorioRepository';

export class CreateRelatorioUseCase {
  constructor(private relatorioRepository: IRelatorioRepository) {}

  async execute(data: CreateRelatorioDTO): Promise<RelatorioResponseDTO> {
    const relatorio = await this.relatorioRepository.create(data);
    return relatorio;
  }
}
