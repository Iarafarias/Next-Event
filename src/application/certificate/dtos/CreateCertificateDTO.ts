export interface CreateCertificateDTO {
  userId: string;
  file: Express.Multer.File;
  title?: string;
  description?: string;
  institution?: string;
  workload?: number;
  startDate?: string;
  endDate?: string;
} 