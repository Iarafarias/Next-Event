import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';

export class ValidarCertificadoPorCoordenadorUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute(certificadoId: string, coordenadorId: string, aprovado: boolean, comentarios?: string): Promise<void> {
    // Atualiza status do certificado e registra o coordenador responsável
    await this.certificateRepository.validarPorCoordenador(certificadoId, coordenadorId, aprovado, comentarios);
  }
}
