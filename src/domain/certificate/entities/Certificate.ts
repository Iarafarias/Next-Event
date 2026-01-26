import crypto from 'node:crypto';
export type CertificateStatus = 'pending' | 'approved' | 'rejected';
import type { CategoriaWorkload } from '@prisma/client';

interface CertificateProps {
  userId: string;
  requestId?: string;
  title: string;
  description: string;
  institution: string;
  workload: number;
  startDate: Date;
  endDate: Date;
  certificateUrl: string;
  adminComments?: string;
  category: CategoriaWorkload;
  studentName?: string;
}


export class Certificate {
  id!: string;
  userId!: string;
  requestId?: string;
  title!: string;
  description!: string;
  institution!: string;
  workload!: number;
  startDate!: Date;
  endDate!: Date;
  certificateUrl!: string;
  status!: CertificateStatus;
  adminComments?: string;
  createdAt!: Date;
  updatedAt!: Date;
  category!: CategoriaWorkload;
  studentName?: string;


  constructor(props: CertificateProps) {
    Object.assign(this, {
      ...props,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      category: props.category,
    });
  }

  isValid(referenceStartDate: Date, referenceEndDate: Date): boolean {
    return this.startDate >= referenceStartDate && this.endDate <= referenceEndDate;
  }

  approve(): void {
    this.status = 'approved';
    this.updatedAt = new Date();
  }

  reject(reason: string): void {
    this.status = 'rejected';
    this.adminComments = reason;
    this.updatedAt = new Date();
  }

  get fileName(): string {
    return this.title;
  }

  get filePath(): string {
    return this.certificateUrl;
  }

  get month(): number {
    return this.startDate.getMonth() + 1;
  }

  get year(): number {
    return this.startDate.getFullYear();
  }
}
