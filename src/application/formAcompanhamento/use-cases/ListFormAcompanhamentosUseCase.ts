import { FormAcompanhamentoResponseDTO } from '../dtos/FormAcompanhamentoResponseDTO';
import { IFormAcompanhamentoRepository } from '../../../domain/formAcompanhamento/repositories/IFormAcompanhamentoRepository';

export class ListFormAcompanhamentosUseCase {
  constructor(private formAcompanhamentoRepository: IFormAcompanhamentoRepository) {}

  async execute(): Promise<FormAcompanhamentoResponseDTO[]> {
    return this.formAcompanhamentoRepository.list();
  }
}
