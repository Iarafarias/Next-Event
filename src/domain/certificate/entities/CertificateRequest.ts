export interface CertificateRequest {
  id: string;
  month: number;
  year: number;
  startDate: Date;
  endDate: Date;
  status: 'open' | 'closed';
  description: string;
  createdAt: Date;
  updatedAt: Date;
} 