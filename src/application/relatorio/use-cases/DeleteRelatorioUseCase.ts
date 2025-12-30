import { IRelatorioRepository } from '../../../domain/relatorio/repositories/IRelatorioRepository';

export class DeleteRelatorioUseCase {
  constructor(private relatorioRepository: IRelatorioRepository) {}

  async execute(id: string): Promise<void> {
    await this.relatorioRepository.delete(id);
  }
}
