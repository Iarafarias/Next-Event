import { FormAcompanhamentoResponseDTO } from '../dtos/FormAcompanhamentoResponseDTO';
import { IFormAcompanhamentoRepository } from '../../../domain/formAcompanhamento/repositories/IFormAcompanhamentoRepository';

export class GetFormAcompanhamentoByIdUseCase {
  constructor(private formAcompanhamentoRepository: IFormAcompanhamentoRepository) {}

  async execute(id: string): Promise<FormAcompanhamentoResponseDTO | null> {
    return this.formAcompanhamentoRepository.getById(id);
  }
}
