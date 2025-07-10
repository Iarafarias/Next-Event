export interface CreateCertificateDTO {
  userId: string;
  requestId: string;
  title: string;
  description: string;
  institution: string;
  workload: number;
  startDate: Date;
  endDate: Date;
  certificateUrl: string;
} 