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
  ) { }

  async execute(data: CreateCertificateDTO): Promise<Certificate> {
    try {
      const setReferenceUseCase = new SetReferenceMonthUseCase();
      const reference = await setReferenceUseCase.getCurrentReference();

      if (!reference) {
        throw new Error('Reference month not set by admin');
      }

      const filePath = await this.storageService.uploadFile(data.file);

      let pdfInfo = null;
      let workload = data.workload;
      let startDate: Date;
      let endDate: Date;

      if (!workload) {
        const physicalPath = this.storageService.getPhysicalPath(filePath);
        pdfInfo = await this.pdfProcessor.extractInformation(physicalPath);
        workload = pdfInfo.workload;

        if (!pdfInfo || !pdfInfo.year || !pdfInfo.month) {
          await this.storageService.deleteFile(filePath);
          throw new Error(`Não foi possível extrair informações de data e carga horária do PDF. Por favor, preencha manualmente.`);
        }

        startDate = new Date(pdfInfo.year, pdfInfo.month - 1, 1);
        endDate = new Date(pdfInfo.year, pdfInfo.endMonth || pdfInfo.month, 0);

      } else {
        startDate = data.startDate ? new Date(data.startDate) : new Date(reference.year, reference.month - 1, 1);
        endDate = data.endDate ? new Date(data.endDate) : new Date(reference.year, reference.month, 0);
      }

      const certificate = new Certificate({
        userId: data.userId,
        requestId: undefined,
        title: data.title || data.file.originalname,
        description: data.description || `Certificado enviado em ${new Date().toLocaleDateString('pt-BR')}`,
        institution: data.institution || 'Não informado',
        workload: workload || 0,
        startDate,
        endDate,
        certificateUrl: filePath,
        category: (data.category as any) || 'EVENTOS'
      });


      const savedCertificate = await this.certificateRepository.create(certificate);
      return savedCertificate;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to process certificate: ' + error.message);
      }
      throw new Error('Failed to process certificate');
    }
  }
} 