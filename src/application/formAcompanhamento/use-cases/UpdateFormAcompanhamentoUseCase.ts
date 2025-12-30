import { UpdateFormAcompanhamentoDTO } from '../dtos/UpdateFormAcompanhamentoDTO';
import { FormAcompanhamentoResponseDTO } from '../dtos/FormAcompanhamentoResponseDTO';
import { IFormAcompanhamentoRepository } from '../../../domain/formAcompanhamento/repositories/IFormAcompanhamentoRepository';

export class UpdateFormAcompanhamentoUseCase {
  constructor(private formAcompanhamentoRepository: IFormAcompanhamentoRepository) {}

  async execute(id: string, data: UpdateFormAcompanhamentoDTO): Promise<FormAcompanhamentoResponseDTO | null> {
    return this.formAcompanhamentoRepository.update(id, data);
  }
}
