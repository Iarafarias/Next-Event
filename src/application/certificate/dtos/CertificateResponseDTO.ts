export interface CertificateResponseDTO {
  id: string;
  userId: string;
  title: string;
  description: string;
  institution: string;
  workload: number;
  startDate: Date;
  endDate: Date;
  certificateUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  adminComments?: string;
  createdAt: Date;
  updatedAt: Date;
  userName?: string; // Campo opcional para incluir o nome do usuário quando necessário
} 