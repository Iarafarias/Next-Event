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
      const reference = SetReferenceMonthUseCase.getCurrentReference();
      console.log('Current reference in upload:', reference);
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

        const certificateStartDate = new Date(pdfInfo.year, pdfInfo.month - 1, 1);
        const certificateEndDate = new Date(pdfInfo.year, pdfInfo.endMonth, 0);

        const referenceStartDate = new Date(reference.year, reference.month - 1, 1);
        const referenceEndDate = new Date(reference.year, reference.month, 0);

        if (certificateStartDate > referenceStartDate || certificateEndDate < referenceEndDate) {
          await this.storageService.deleteFile(filePath);
          throw new Error(`Certificate period (${pdfInfo.month}/${pdfInfo.year} to ${pdfInfo.endMonth}/${pdfInfo.year}) must include reference month ${reference.month}/${reference.year}`);
        }

        startDate = new Date(pdfInfo.year, pdfInfo.month - 1, 1);
        endDate = new Date(pdfInfo.year, pdfInfo.endMonth, 0);
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
        certificateUrl: filePath
      });

      console.log('Certificate created:', {
        userId: certificate.userId,
        title: certificate.title,
        workload: certificate.workload,
        startDate: certificate.startDate,
        endDate: certificate.endDate
      });

      console.log('Saving certificate to repository...');
      const savedCertificate = await this.certificateRepository.create(certificate);
      console.log('Certificate saved successfully:', savedCertificate.id);
      return savedCertificate;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Failed to process certificate: ' + error.message);
      }
      throw new Error('Failed to process certificate');
    }
  }
} 