import { Prisma, PrismaClient } from '.prisma/client';
import { Certificate } from '../../../domain/certificate/entities/Certificate';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';

type PrismaCertificate = Prisma.CertificateGetPayload<{
  include: { user: { select: { name: true } } }
}>;

export class PostgresCertificateRepository implements ICertificateRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private mapToCertificate(data: PrismaCertificate): Certificate {
    const certificate = new Certificate({
      userId: data.userId,
      requestId: data.requestId || undefined,
      title: data.title,
      description: data.description,
      institution: data.institution,
      workload: data.workload,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      certificateUrl: data.certificateUrl,
      adminComments: data.adminComments || undefined
    });
    certificate.id = data.id;
    certificate.status = data.status as 'pending' | 'approved' | 'rejected';
    certificate.createdAt = data.createdAt;
    certificate.updatedAt = data.updatedAt;
    
    return certificate;
  }

  async create(certificate: Certificate): Promise<Certificate> {
    const createData: any = {
      id: certificate.id,
      userId: certificate.userId,
      title: certificate.title,
      description: certificate.description,
      institution: certificate.institution,
      workload: certificate.workload,
      startDate: certificate.startDate,
      endDate: certificate.endDate,
      certificateUrl: certificate.certificateUrl,
      status: certificate.status,
      adminComments: certificate.adminComments
    };
    if (certificate.requestId) {
      createData.requestId = certificate.requestId;
    }

    await this.prisma.certificate.create({
      data: createData
    });
    const result = await this.prisma.certificate.findUnique({
      where: { id: certificate.id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!result) {
      throw new Error('Failed to create certificate');
    }

    return this.mapToCertificate(result);
  }

  async findById(id: string): Promise<Certificate | null> {
    const result = await this.prisma.certificate.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return result ? this.mapToCertificate(result) : null;
  }

  async findByUserId(userId: string): Promise<Certificate[]> {
    const results = await this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return results.map((result) => this.mapToCertificate(result));
  }

  async update(certificate: Certificate): Promise<Certificate> {
    const result = await this.prisma.certificate.update({
      where: { id: certificate.id },
      data: {
        title: certificate.title,
        description: certificate.description,
        institution: certificate.institution,
        workload: certificate.workload,
        startDate: certificate.startDate,
        endDate: certificate.endDate,
        certificateUrl: certificate.certificateUrl,
        status: certificate.status,
        adminComments: certificate.adminComments,
        updatedAt: certificate.updatedAt
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return this.mapToCertificate(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.certificate.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Certificate[]> {
    const results = await this.prisma.certificate.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return results.map((result) => this.mapToCertificate(result));
  }

  async findByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Certificate[]> {
    const results = await this.prisma.certificate.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return results.map((result) => this.mapToCertificate(result));
  }

  async findByUserIdAndStatus(userId: string, status: 'pending' | 'approved' | 'rejected'): Promise<Certificate[]> {
    const results = await this.prisma.certificate.findMany({
      where: { 
        userId,
        status,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return results.map((result) => this.mapToCertificate(result));
  }
} 