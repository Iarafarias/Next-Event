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

      // Process PDF to extract information if not provided
      let pdfInfo = null;
      let workload = data.workload;
      
      if (!workload) {
        pdfInfo = await this.pdfProcessor.extractInformation(filePath);
        workload = pdfInfo.workload;
        
        // Validate month and year only if we extracted from PDF
        if (pdfInfo.month !== reference.month || pdfInfo.year !== reference.year) {
          await this.storageService.deleteFile(filePath);
          throw new Error(`Certificate must be from ${reference.month}/${reference.year}`);
        }
      }

      // Create certificate with provided data or defaults
      const startDate = data.startDate ? new Date(data.startDate) : new Date(reference.year, reference.month - 1, 1);
      const endDate = data.endDate ? new Date(data.endDate) : new Date(reference.year, reference.month, 0);
      
      const certificate = new Certificate({
        userId: data.userId,
        requestId: 'default-request-id', // TODO: Implementar logic para requestId
        title: data.title || data.file.originalname,
        description: data.description || `Certificado enviado em ${new Date().toLocaleDateString('pt-BR')}`,
        institution: data.institution || 'Não informado',
        workload: workload || 0,
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