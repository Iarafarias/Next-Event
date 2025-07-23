import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';
import { Certificate } from '../../../domain/certificate/entities/Certificate';

export interface GenerateReportRequest {
  month: number;
  year: number;
}

export interface ReportData {
  referenceMonth: number;
  referenceYear: number;
  totalCertificates: number;
  validCertificates: Certificate[];
  invalidCertificates: Certificate[];
  totalHoursValid: number;
  totalHoursInvalid: number;
}

export class GenerateReportUseCase {
  constructor(private certificateRepository: ICertificateRepository) {}

  async execute({ month, year }: GenerateReportRequest): Promise<ReportData> {
    const certificates = await this.certificateRepository.findAll();
    const { validCertificates, invalidCertificates } = this.categorizeCertificates(
      certificates,
      month,
      year
    );

    const totalHoursValid = validCertificates.reduce(
      (sum, cert) => sum + cert.workload,
      0
    );

    const totalHoursInvalid = invalidCertificates.reduce(
      (sum, cert) => sum + cert.workload,
      0
    );

    return {
      referenceMonth: month,
      referenceYear: year,
      totalCertificates: certificates.length,
      validCertificates,
      invalidCertificates,
      totalHoursValid,
      totalHoursInvalid,
    };
  }

  private categorizeCertificates(
    certificates: Certificate[],
    referenceMonth: number,
    referenceYear: number
  ): { validCertificates: Certificate[]; invalidCertificates: Certificate[] } {
    const referenceStartDate = new Date(referenceYear, referenceMonth - 1, 1);
    const referenceEndDate = new Date(referenceYear, referenceMonth, 0);
    
    return certificates.reduce(
      (acc, certificate) => {
        if (certificate.isValid(referenceStartDate, referenceEndDate)) {
          acc.validCertificates.push(certificate);
        } else {
          acc.invalidCertificates.push(certificate);
        }
        return acc;
      },
      { validCertificates: [], invalidCertificates: [] } as { 
        validCertificates: Certificate[];
        invalidCertificates: Certificate[];
      }
    );
  }
}
