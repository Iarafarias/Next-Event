import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';

export interface DeleteCertificateRequest {
  id: string;
  userId?: string;
}

export class DeleteCertificateUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute({ id, userId }: DeleteCertificateRequest): Promise<void> {
    const certificate = await this.certificateRepository.findById(id);
    
    if (!certificate) {
      throw new Error('Certificate not found');
    }
    if (userId && certificate.userId !== userId) {
      throw new Error('Unauthorized to delete this certificate');
    }

    await this.certificateRepository.delete(id);
  }
}
