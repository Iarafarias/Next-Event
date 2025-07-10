export interface UpdateCertificateDTO {
  id: string;
  title?: string;
  description?: string;
  institution?: string;
  workload?: number;
  startDate?: Date;
  endDate?: Date;
  certificateUrl?: string;
  status?: 'pending' | 'approved' | 'rejected';
  adminComments?: string;
} 