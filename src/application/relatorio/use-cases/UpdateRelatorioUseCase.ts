import { UpdateRelatorioDTO } from '../dtos/UpdateRelatorioDTO';
import { RelatorioResponseDTO } from '../dtos/RelatorioResponseDTO';
import { IRelatorioRepository } from '../../../domain/relatorio/repositories/IRelatorioRepository';

export class UpdateRelatorioUseCase {
  constructor(private relatorioRepository: IRelatorioRepository) {}

  async execute(data: UpdateRelatorioDTO): Promise<RelatorioResponseDTO> {
    const relatorio = await this.relatorioRepository.update(data);
    return relatorio;
  }
}
