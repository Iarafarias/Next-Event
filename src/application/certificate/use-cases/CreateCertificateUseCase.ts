import { Certificate } from '../../../domain/certificate/entities/Certificate';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { CreateCertificateDTO } from '../dtos/CreateCertificateDTO';
import { IStorageService } from '../../../domain/certificate/services/IStorageService';
import { IPDFProcessor } from '../../../domain/certificate/services/IPDFProcessor';

export class CreateCertificateUseCase {
  constructor(
    private certificateRepository: ICertificateRepository,
    private storageService: IStorageService,
    private pdfProcessor: IPDFProcessor
  ) {}

  async execute(data: CreateCertificateDTO): Promise<Certificate> {
    const filePath = await this.storageService.uploadFile(data.file);
    // Usar caminho físico para processar o PDF
    const physicalPath = this.storageService.getPhysicalPath(filePath);
    const { workload, month, year } = await this.pdfProcessor.extractInformation(physicalPath);
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const certificate = new Certificate({
      userId: data.userId,
      requestId: 'default-request-id', // TODO: Implementar logic para requestId
      title: data.file.originalname,
      description: `Certificado enviado em ${new Date().toLocaleDateString('pt-BR')}`,
      institution: 'Não informado',
      workload,
      startDate,
      endDate,
      certificateUrl: filePath
    });

    return this.certificateRepository.create(certificate);
  }
} 