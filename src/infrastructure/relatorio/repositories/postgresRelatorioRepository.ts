  import { PrismaClient } from '.prisma/client';
  import { IRelatorioRepository } from '../../../domain/relatorio/repositories/IRelatorioRepository';
  import { CreateRelatorioDTO } from '../../../application/relatorio/dtos/CreateRelatorioDTO';
  import { UpdateRelatorioDTO } from '../../../application/relatorio/dtos/UpdateRelatorioDTO';
  import { RelatorioResponseDTO } from '../../../application/relatorio/dtos/RelatorioResponseDTO';

  export class PostgresRelatorioRepository implements IRelatorioRepository {
    private prisma: PrismaClient;

    constructor() {
      this.prisma = new PrismaClient();
    }

    async create(data: CreateRelatorioDTO): Promise<RelatorioResponseDTO> {
      const relatorio = await this.prisma.relatorio.create({
        data: {
          titulo: data.titulo,
          descricao: data.descricao,
          tipo: data.tipo,
          geradorId: data.geradorId,
          periodoId: data.periodoId,
          arquivoUrl: data.arquivoUrl,
        },
      });
      return this.mapToResponseDTO(relatorio);
    }

    async update(data: UpdateRelatorioDTO): Promise<RelatorioResponseDTO> {
      const relatorio = await this.prisma.relatorio.update({
        where: { id: data.id },
        data: {
          titulo: data.titulo,
          descricao: data.descricao,
          tipo: data.tipo,
          periodoId: data.periodoId,
          arquivoUrl: data.arquivoUrl,
        },
      });
      return this.mapToResponseDTO(relatorio);
    }

    async findById(id: string): Promise<RelatorioResponseDTO | null> {
      const relatorio = await this.prisma.relatorio.findUnique({ where: { id } });
      return relatorio ? this.mapToResponseDTO(relatorio) : null;
    }

    async findAll(): Promise<RelatorioResponseDTO[]> {
      const relatorios = await this.prisma.relatorio.findMany({ orderBy: { criadoEm: 'desc' } });
      return relatorios.map((r) => this.mapToResponseDTO(r));
    }

    async delete(id: string): Promise<void> {
      await this.prisma.relatorio.delete({ where: { id } });
    }

    async listByCoordenador(coordenadorId: string): Promise<RelatorioResponseDTO[]> {
      const relatorios = await this.prisma.relatorio.findMany({
        where: { geradorId: coordenadorId },
        orderBy: { criadoEm: 'desc' }
      });
      return relatorios.map((r) => this.mapToResponseDTO(r));
    }

    async listByTutor(tutorId: string): Promise<RelatorioResponseDTO[]> {
      const relatorios = await this.prisma.relatorio.findMany({
        where: { geradorId: tutorId },
        orderBy: { criadoEm: 'desc' }
      });
      return relatorios.map((r) => this.mapToResponseDTO(r));
    }

    async listByBolsista(bolsistaId: string): Promise<RelatorioResponseDTO[]> {
      const relatorios = await this.prisma.relatorio.findMany({
        where: { geradorId: bolsistaId },
        orderBy: { criadoEm: 'desc' }
      });
      return relatorios.map((r) => this.mapToResponseDTO(r));
    }

    private mapToResponseDTO(relatorio: any): RelatorioResponseDTO {
      return {
        id: relatorio.id,
        titulo: relatorio.titulo,
        descricao: relatorio.descricao,
        tipo: relatorio.tipo,
        geradorId: relatorio.geradorId,
        periodoId: relatorio.periodoId,
        arquivoUrl: relatorio.arquivoUrl,
        criadoEm: relatorio.criadoEm,
        atualizadoEm: relatorio.atualizadoEm,
      };
    }
  }
