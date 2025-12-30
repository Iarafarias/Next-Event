import { IFormAcompanhamentoRepository } from '../../../domain/formAcompanhamento/repositories/IFormAcompanhamentoRepository';

export class DeleteFormAcompanhamentoUseCase {
  constructor(private formAcompanhamentoRepository: IFormAcompanhamentoRepository) {}

  async execute(id: string): Promise<void> {
    await this.formAcompanhamentoRepository.delete(id);
  }
}
