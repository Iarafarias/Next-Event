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
    const { user, ...certificate } = data;
    return certificate as Certificate;
  }

  async create(certificate: Certificate): Promise<Certificate> {
    const { id, startDate, endDate, createdAt, updatedAt, ...data } = certificate;
    
    const result = await this.prisma.certificate.create({
      data: {
        id,
        ...data,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(),
        updatedAt: new Date(),
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

    return results.map(this.mapToCertificate);
  }

  async update(certificate: Certificate): Promise<Certificate> {
    const { id, startDate, endDate, updatedAt, ...data } = certificate;
    
    const result = await this.prisma.certificate.update({
      where: { id },
      data: {
        ...data,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        updatedAt: new Date(),
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

    return results.map(this.mapToCertificate);
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

    return results.map(this.mapToCertificate);
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

    return results.map(this.mapToCertificate);
  }
} 