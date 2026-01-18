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
        throw new Error('Mês de referência não definido pelo coordenador');
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

        const certificateStartDate = new Date(pdfInfo.year, pdfInfo.month - 1, pdfInfo.day || 1);
        const certificateEndDate = new Date(pdfInfo.year, pdfInfo.endMonth - 1, pdfInfo.endDay || 0);

        const referenceStartDate = new Date(reference.year, reference.month - 1, 1);
        const referenceEndDate = new Date(reference.year, reference.month, 0);

        if (certificateStartDate > referenceStartDate || certificateEndDate < referenceEndDate) {
          await this.storageService.deleteFile(filePath);
          throw new Error(`Período do certificado: (${pdfInfo.month}/${pdfInfo.year} até ${pdfInfo.endMonth}/${pdfInfo.year}). Mês de referência: ${reference.month}/${reference.year}`);
        }

        startDate = certificateStartDate;
        endDate = certificateEndDate;
      } else {
        startDate = data.startDate ? new Date(data.startDate) : new Date(reference.year, reference.month - 1, 1);
        endDate = data.endDate ? new Date(data.endDate) : new Date(reference.year, reference.month, 0);
      }

      const certificate = new Certificate({
        userId: data.userId,
        requestId: undefined,
        title: data.title || pdfInfo?.title || data.file.originalname,
        description: data.description || `Certificado enviado em ${new Date().toLocaleDateString('pt-BR')}`,
        institution: data.institution || 'Não informado',
        workload: workload || 0,
        startDate,
        endDate,
        certificateUrl: filePath,
        category: 'EVENTOS'
      });

      const savedCertificate = await this.certificateRepository.create(certificate);
      return savedCertificate;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Falha ao processar certificado: ' + error.message);
      }
      throw new Error('Falha ao processar certificado');
    }
  }
} 