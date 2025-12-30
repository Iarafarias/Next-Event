import { Prisma, PrismaClient } from '.prisma/client';
import { Certificate } from '../../../domain/certificate/entities/Certificate';
import { ICertificateRepository } from '../../../domain/certificate/repositories/ICertificateRepository';

type PrismaCertificado = Prisma.CertificadoGetPayload<{
  include: { bolsista: { include: { usuario: { select: { id: true, nome: true } } } } }
}>;

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

  async emitirPorTutor(tutorId: string, dados: Omit<Certificate, 'id'>): Promise<Certificate> {
    const result = await this.prisma.certificado.create({
      data: {
        bolsistaId: dados.userId,
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
      include: { bolsista: { include: { usuario: { select: { id: true, nome: true } } } } }
    });
    return this.mapToCertificate(result);
  }

  async solicitarPorBolsista(bolsistaId: string, dados: Omit<Certificate, 'id'>): Promise<Certificate> {
    const result = await this.prisma.certificado.create({
      data: {
        bolsistaId,
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
      include: { bolsista: { include: { usuario: { select: { id: true, nome: true } } } } }
    });
    return this.mapToCertificate(result);
  }

  async listByCoordenador(coordenadorId: string): Promise<Certificate[]> {
    const results = await this.prisma.certificado.findMany({
      orderBy: { criadoEm: 'desc' },
      include: { bolsista: { include: { usuario: { select: { id: true, nome: true } } } } }
    });
    return results.map((result: any) => this.mapToCertificate(result));
  }

  async listByTutor(tutorId: string): Promise<Certificate[]> {
    const results = await this.prisma.certificado.findMany({
      orderBy: { criadoEm: 'desc' },
      include: { bolsista: { include: { usuario: { select: { id: true, nome: true } } } } }
    });
    return results.map((result: any) => this.mapToCertificate(result));
  }

  async listByBolsista(bolsistaId: string): Promise<Certificate[]> {
    const results = await this.prisma.certificado.findMany({
      where: { bolsistaId },
      orderBy: { criadoEm: 'desc' },
      include: { bolsista: { include: { usuario: { select: { id: true, nome: true } } } } }
    });
    return results.map((result: any) => this.mapToCertificate(result));
  }

  private mapToCertificate(data: PrismaCertificado): Certificate {
    const ownerUserId = data.bolsista?.usuario?.id ?? undefined;
    const certificate = new Certificate({
      userId: ownerUserId || data.bolsistaId,
      title: data.titulo,
      description: '',
      institution: data.instituicao,
      workload: data.cargaHoraria,
      startDate: new Date(data.dataInicio),
      endDate: new Date(data.dataFim),
      certificateUrl: data.arquivoUrl,
      adminComments: data.comentariosAdmin || undefined,
      category: data.categoria
    });
    certificate.id = data.id;
    const statusMap: Record<string, Certificate['status']> = {
      PENDENTE: 'pending',
      APROVADO: 'approved',
      REJEITADO: 'rejected'
    };
    certificate.status = statusMap[data.status as unknown as string] ?? ('pending' as Certificate['status']);
    certificate.createdAt = data.criadoEm;
    certificate.updatedAt = data.atualizadoEm;

    return certificate;
  }

  async create(certificate: Certificate): Promise<Certificate> {
    let bolsistaId: string | undefined = undefined;
    if (certificate.userId) {
      const bolsista = await this.prisma.bolsista.findUnique({ where: { usuarioId: certificate.userId } });
      if (bolsista) bolsistaId = bolsista.id;
    }

    const createData: any = {
      id: certificate.id,
      bolsistaId: bolsistaId,
      titulo: certificate.title,
      instituicao: certificate.institution,
      cargaHoraria: certificate.workload,
      categoria: certificate.category,
      arquivoUrl: certificate.certificateUrl,
      status: (certificate.status === 'pending' ? 'PENDENTE' : certificate.status === 'approved' ? 'APROVADO' : 'REJEITADO'),
      comentariosAdmin: certificate.adminComments,
      dataInicio: certificate.startDate,
      dataFim: certificate.endDate
    };

    await this.prisma.certificado.create({ data: createData });
    const result = await this.prisma.certificado.findUnique({
      where: { id: certificate.id },
      include: {
        bolsista: { include: { usuario: { select: { id: true, nome: true } } } }
      },
    });

    if (!result) {
      throw new Error('Failed to create certificate');
    }

    return this.mapToCertificate(result);
  }

  async findById(id: string): Promise<Certificate | null> {
    const result = await this.prisma.certificado.findUnique({
      where: { id },
      include: { bolsista: { include: { usuario: { select: { id: true, nome: true } } } } }
    });

    return result ? this.mapToCertificate(result) : null;
  }

  async findByUserId(userId: string): Promise<Certificate[]> {
    const bolsista = await this.prisma.bolsista.findUnique({ where: { usuarioId: userId } });
    if (!bolsista) return [];
    const results = await this.prisma.certificado.findMany({
      where: { bolsistaId: bolsista.id },
      orderBy: { criadoEm: 'desc' },
      include: { bolsista: { include: { usuario: { select: { id: true, nome: true } } } } }
    });

    return results.map((result) => this.mapToCertificate(result));
  }

  async update(certificate: Certificate): Promise<Certificate> {
    const updateData: any = {
      titulo: certificate.title,
      instituicao: certificate.institution,
      cargaHoraria: certificate.workload,
      dataInicio: certificate.startDate,
      dataFim: certificate.endDate,
      arquivoUrl: certificate.certificateUrl,
      status: (certificate.status === 'pending' ? 'PENDENTE' : certificate.status === 'approved' ? 'APROVADO' : 'REJEITADO'),
      comentariosAdmin: certificate.adminComments,
      atualizadoEm: certificate.updatedAt
    };

    const result = await this.prisma.certificado.update({
      where: { id: certificate.id },
      data: updateData,
      include: { bolsista: { include: { usuario: { select: { id: true, nome: true } } } } }
    });

    return this.mapToCertificate(result);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.certificado.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Certificate[]> {
    const results = await this.prisma.certificado.findMany({ orderBy: { criadoEm: 'desc' }, include: { bolsista: { include: { usuario: { select: { id: true, nome: true } } } } } });
    return results.map((result) => this.mapToCertificate(result));
  }

  async findByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Certificate[]> {
    const dbStatus = (status === 'pending' ? 'PENDENTE' : status === 'approved' ? 'APROVADO' : 'REJEITADO');
    const results = await this.prisma.certificado.findMany({ where: { status: dbStatus }, orderBy: { criadoEm: 'desc' }, include: { bolsista: { include: { usuario: { select: { id: true, nome: true } } } } } });
    return results.map((result) => this.mapToCertificate(result));
  }

  async findByUserIdAndStatus(userId: string, status: 'pending' | 'approved' | 'rejected'): Promise<Certificate[]> {
    const bolsista = await this.prisma.bolsista.findUnique({ where: { usuarioId: userId } });
    if (!bolsista) return [];
    const dbStatus = (status === 'pending' ? 'PENDENTE' : status === 'approved' ? 'APROVADO' : 'REJEITADO');
    const results = await this.prisma.certificado.findMany({ where: { bolsistaId: bolsista.id, status: dbStatus }, orderBy: { criadoEm: 'desc' }, include: { bolsista: { include: { usuario: { select: { id: true, nome: true } } } } } });
    return results.map((result) => this.mapToCertificate(result));
  }
} 