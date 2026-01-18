import { Prisma, PrismaClient } from '@prisma/client';
import { Certificate } from '../../../domain/certificate/entities/Certificate';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';

// type PrismaCertificado = Prisma.CertificadoGetPayload<{
//   include: { usuario: { select: { id: true, nome: true } } }
// }>;

export class PostgresCertificateRepository implements ICertificateRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async validarPorCoordenador(certificadoId: string, coordenadorId: string, aprovado: boolean, comentarios?: string): Promise<void> {
    await this.prisma.certificado.update({
      where: { id: certificadoId },
      data: {
        status: aprovado ? 'APROVADO' : 'REJEITADO',
        comentariosAdmin: comentarios ?? undefined
      }
    });
  }

  private mapToPlainObject(data: any): any {
    const statusMap: Record<string, string> = {
      PENDENTE: 'pending',
      APROVADO: 'approved',
      REJEITADO: 'rejected'
    };

    // Retorna um objeto PURO para evitar problemas de serialização da classe
    return {
      id: data.id,
      userId: data.usuario?.id ?? data.usuarioId,
      title: data.titulo,
      description: '',
      institution: data.instituicao,
      workload: data.cargaHoraria,
      startDate: data.dataInicio,
      endDate: data.dataFim,
      certificateUrl: data.arquivoUrl,
      status: statusMap[data.status] || 'pending',
      adminComments: data.comentariosAdmin || undefined,
      category: data.categoria,
      createdAt: data.criadoEm,
      updatedAt: data.atualizadoEm
    };
  }

  async emitirPorTutor(tutorId: string, dados: Omit<Certificate, 'id'>): Promise<Certificate> {
    const result = await this.prisma.certificado.create({
      data: {
        usuarioId: dados.userId,
        titulo: dados.title,
        instituicao: dados.institution,
        cargaHoraria: dados.workload,
        categoria: dados.category,
        arquivoUrl: dados.certificateUrl,
        status: 'PENDENTE',
        comentariosAdmin: dados.adminComments,
        dataInicio: dados.startDate,
        dataFim: dados.endDate
      },
      include: { usuario: { select: { id: true, nome: true } } }
    });
    return this.mapToPlainObject(result) as any;
  }

  async solicitarPorBolsista(usuarioId: string, dados: Omit<Certificate, 'id'>): Promise<Certificate> {
    const result = await this.prisma.certificado.create({
      data: {
        usuarioId,
        titulo: dados.title,
        instituicao: dados.institution,
        cargaHoraria: dados.workload,
        categoria: dados.category,
        arquivoUrl: dados.certificateUrl,
        status: 'PENDENTE',
        comentariosAdmin: dados.adminComments,
        dataInicio: dados.startDate,
        dataFim: dados.endDate
      },
      include: { usuario: { select: { id: true, nome: true } } }
    });
    return this.mapToPlainObject(result) as any;
  }

  async listByCoordenador(coordenadorId: string): Promise<Certificate[]> {
    const results = await this.prisma.certificado.findMany({
      orderBy: { criadoEm: 'desc' },
      include: { usuario: { select: { id: true, nome: true } } }
    });
    return results.map((result: any) => this.mapToPlainObject(result));
  }

  async listByTutor(tutorId: string): Promise<Certificate[]> {
    const results = await this.prisma.certificado.findMany({
      orderBy: { criadoEm: 'desc' },
      include: { usuario: { select: { id: true, nome: true } } }
    });
    return results.map((result: any) => this.mapToPlainObject(result));
  }

  async listByBolsista(usuarioId: string): Promise<Certificate[]> {
    const results = await this.prisma.certificado.findMany({
      where: { usuarioId },
      orderBy: { criadoEm: 'desc' },
      include: { usuario: { select: { id: true, nome: true } } }
    });
    return results.map((result: any) => this.mapToPlainObject(result));
  }

  async create(certificate: Certificate): Promise<Certificate> {
    const result = await this.prisma.certificado.create({
      data: {
        id: certificate.id,
        usuarioId: certificate.userId,
        titulo: certificate.title,
        instituicao: certificate.institution,
        cargaHoraria: certificate.workload,
        categoria: certificate.category,
        arquivoUrl: certificate.certificateUrl,
        status: (certificate.status === 'pending' ? 'PENDENTE' : certificate.status === 'approved' ? 'APROVADO' : 'REJEITADO'),
        comentariosAdmin: certificate.adminComments,
        dataInicio: certificate.startDate,
        dataFim: certificate.endDate
      },
      include: { usuario: { select: { id: true, nome: true } } }
    });

    return this.mapToPlainObject(result) as any;
  }

  async findById(id: string): Promise<Certificate | null> {
    const result = await this.prisma.certificado.findUnique({
      where: { id },
      include: { usuario: { select: { id: true, nome: true } } }
    });

    return result ? this.mapToPlainObject(result) as any : null;
  }

  async findByUserId(userId: string): Promise<Certificate[]> {
    const results = await this.prisma.certificado.findMany({
      where: { usuarioId: userId },
      orderBy: { criadoEm: 'desc' },
      include: { usuario: { select: { id: true, nome: true } } }
    });

    return results.map((result) => this.mapToPlainObject(result) as any);
  }

  async update(certificate: Certificate): Promise<Certificate> {
    const result = await this.prisma.certificado.update({
      where: { id: certificate.id },
      data: {
        titulo: certificate.title,
        instituicao: certificate.institution,
        cargaHoraria: certificate.workload,
        dataInicio: certificate.startDate,
        dataFim: certificate.endDate,
        arquivoUrl: certificate.certificateUrl,
        status: (certificate.status === 'pending' ? 'PENDENTE' : certificate.status === 'approved' ? 'APROVADO' : 'REJEITADO'),
        comentariosAdmin: certificate.adminComments,
        atualizadoEm: certificate.updatedAt
      },
      include: { usuario: { select: { id: true, nome: true } } }
    });

    return this.mapToPlainObject(result) as any;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.certificado.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Certificate[]> {
    const results = await this.prisma.certificado.findMany({
      orderBy: { criadoEm: 'desc' },
      include: { usuario: { select: { id: true, nome: true } } }
    });
    return results.map((result) => this.mapToPlainObject(result) as any);
  }

  async findByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Certificate[]> {
    const dbStatus = (status === 'pending' ? 'PENDENTE' : status === 'approved' ? 'APROVADO' : 'REJEITADO');
    const results = await this.prisma.certificado.findMany({
      where: { status: dbStatus },
      orderBy: { criadoEm: 'desc' },
      include: { usuario: { select: { id: true, nome: true } } }
    });
    return results.map((result) => this.mapToPlainObject(result) as any);
  }

  async findByUserIdAndStatus(userId: string, status: 'pending' | 'approved' | 'rejected'): Promise<Certificate[]> {
    const dbStatus = (status === 'pending' ? 'PENDENTE' : status === 'approved' ? 'APROVADO' : 'REJEITADO');
    const results = await this.prisma.certificado.findMany({
      where: { usuarioId: userId, status: dbStatus },
      orderBy: { criadoEm: 'desc' },
      include: { usuario: { select: { id: true, nome: true } } }
    });
    return results.map((result) => this.mapToPlainObject(result) as any);
  }
}