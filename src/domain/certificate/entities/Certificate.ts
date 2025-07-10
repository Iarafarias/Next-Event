export interface Certificate {
  id: string;
  userId: string;
  requestId: string;
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
}
