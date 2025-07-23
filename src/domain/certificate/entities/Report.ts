export interface ReportData {
  userId: string;
  userName: string;
  userEmail: string;
  month: number;
  year: number;
  totalCertificates: number;
  approvedCertificates: number;
  rejectedCertificates: number;
  pendingCertificates: number;
  totalWorkload: number;
  averageWorkload: number;
  meetsMinimumRequirement: boolean;
  minimumWorkload: number;
  certificates: {
    id: string;
    fileName: string;
    workload: number;
    status: string;
    adminComments?: string;
  }[];
}

export class Report {
  id!: string;
  userId!: string;
  month!: number;
  year!: number;
  data!: ReportData;
  generatedAt!: Date;
  generatedBy!: string; // Admin ID

  constructor(props: Omit<Report, 'id' | 'generatedAt'>) {
    Object.assign(this, {
      ...props,
      id: crypto.randomUUID(),
      generatedAt: new Date(),
    });
  }

  getSummary(): string {
    const { data } = this;
    return `Aluno ${data.userName} entregou ${data.totalCertificates} certificados, totalizando uma carga horária de ${data.totalWorkload}h (O mínimo são ${data.minimumWorkload}h). Status: ${data.meetsMinimumRequirement ? 'APROVADO' : 'REPROVADO'}`;
  }
}
