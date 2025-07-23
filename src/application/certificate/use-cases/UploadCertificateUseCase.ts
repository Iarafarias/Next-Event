import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { Certificate } from '../../../domain/certificate/entities/Certificate';
import { CreateCertificateDTO } from '../dtos/CreateCertificateDTO';
import { IPDFProcessor } from '../../../domain/certificate/services/IPDFProcessor';
import { IStorageService } from '../../../domain/certificate/services/IStorageService';
import { SetReferenceMonthUseCase } from './SetReferenceMonthUseCase';

export class UploadCertificateUseCase {
  constructor(
    private certificateRepository: ICertificateRepository,
    private pdfProcessor: IPDFProcessor,
    private storageService: IStorageService
  ) {}

  async execute(data: CreateCertificateDTO): Promise<Certificate> {
    try {
      const reference = SetReferenceMonthUseCase.getCurrentReference();
      if (!reference) {
        throw new Error('Reference month not set by admin');
      }

      // Upload file to storage
      const filePath = await this.storageService.uploadFile(data.file);

      // Process PDF to extract information
      const pdfInfo = await this.pdfProcessor.extractInformation(filePath);

      // Validate month and year
      if (pdfInfo.month !== reference.month || pdfInfo.year !== reference.year) {
        await this.storageService.deleteFile(filePath);
        throw new Error(`Certificate must be from ${reference.month}/${reference.year}`);
      }

      // Create certificate
      const startDate = new Date(pdfInfo.year, pdfInfo.month - 1, 1);
      const endDate = new Date(pdfInfo.year, pdfInfo.month, 0);
      
      const certificate = new Certificate({
        userId: data.userId,
        requestId: 'default-request-id', // TODO: Implementar logic para requestId
        title: data.file.originalname,
        description: `Certificado enviado em ${new Date().toLocaleDateString('pt-BR')}`,
        institution: 'Não informado',
        workload: pdfInfo.workload,
        startDate,
        endDate,
        certificateUrl: filePath
      });

      // Save to repository
      return await this.certificateRepository.create(certificate);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to process certificate: ' + error.message);
      }
      throw new Error('Failed to process certificate');
    }
  }
} 