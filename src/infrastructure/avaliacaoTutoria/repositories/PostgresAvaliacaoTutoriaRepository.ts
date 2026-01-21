import { PrismaClient } from '@prisma/client';
import { IAvaliacaoTutoriaRepository } from '../../../domain/avaliacaoTutoria/repositories/IAvaliacaoTutoriaRepository';
import { AvaliacaoTutoria, AvaliacaoConteudo, StatusAvaliacao } from '../../../domain/avaliacaoTutoria/entities/AvaliacaoTutoria';
import logger from '../../logger/logger';

export class PostgresAvaliacaoTutoriaRepository implements IAvaliacaoTutoriaRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async save(avaliacao: AvaliacaoTutoria): Promise<void> {
    try {
      // Buscar dados do usuário e período para enriquecer o conteúdo
      const [usuario, periodo] = await Promise.all([
        this.prisma.usuario.findUnique({ where: { id: avaliacao.usuarioId } }),
        this.prisma.periodoTutoria.findUnique({ where: { id: avaliacao.periodoId } })
      ]);

      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
      if (!periodo) {
        throw new Error('Período não encontrado');
      }

      const conteudoEnriquecido: AvaliacaoConteudo = {
        ...avaliacao.conteudo,
        nomeAvaliador: usuario.nome,
        periodoAvaliado: periodo.nome
      };

      await this.prisma.avaliacaoTutoria.create({
        data: {
          id: avaliacao.id,
          usuarioId: avaliacao.usuarioId,
          periodoId: avaliacao.periodoId,
          tipoAvaliador: avaliacao.tipoAvaliador,
          conteudo: conteudoEnriquecido as any,
          status: avaliacao.status,
          dataEnvio: avaliacao.dataEnvio,
          dataAtualizacao: avaliacao.dataAtualizacao
        }
      });
    } catch (error: any) {
      logger.error('Erro ao salvar avaliação de tutoria', { error: error.message, avaliacaoId: avaliacao.id });
      throw new Error('Erro ao salvar avaliação de tutoria');
    }
  }

  async findById(id: string): Promise<AvaliacaoTutoria | null> {
    try {
      const avaliacao = await this.prisma.avaliacaoTutoria.findUnique({
        where: { id },
        include: {
          usuario: true,
          periodo: true
        }
      });

      if (!avaliacao) {
        return null;
      }

      return new AvaliacaoTutoria(
        avaliacao.id,
        avaliacao.usuarioId,
        avaliacao.periodoId,
        avaliacao.tipoAvaliador as 'TUTOR' | 'ALUNO',
        avaliacao.conteudo as unknown as AvaliacaoConteudo,
        avaliacao.status as StatusAvaliacao,
        avaliacao.dataEnvio,
        avaliacao.dataAtualizacao
      );
    } catch (error: any) {
      logger.error('Erro ao buscar avaliação de tutoria por ID', { error: error.message, id });
      throw new Error('Erro ao buscar avaliação de tutoria');
    }
  }

  async findByUsuarioId(usuarioId: string): Promise<AvaliacaoTutoria[]> {
    try {
      const avaliacoes = await this.prisma.avaliacaoTutoria.findMany({
        where: { usuarioId },
        include: {
          usuario: true,
          periodo: true
        },
        orderBy: { dataAtualizacao: 'desc' }
      });

      return avaliacoes.map(avaliacao => new AvaliacaoTutoria(
        avaliacao.id,
        avaliacao.usuarioId,
        avaliacao.periodoId,
        avaliacao.tipoAvaliador as 'TUTOR' | 'ALUNO',
        avaliacao.conteudo as unknown as AvaliacaoConteudo,
        avaliacao.status as StatusAvaliacao,
        avaliacao.dataEnvio,
        avaliacao.dataAtualizacao
      ));
    } catch (error: any) {
      logger.error('Erro ao buscar avaliações por usuário', { error: error.message, usuarioId });
      throw new Error('Erro ao buscar avaliações por usuário');
    }
  }

  async findByPeriodoId(periodoId: string): Promise<AvaliacaoTutoria[]> {
    try {
      const avaliacoes = await this.prisma.avaliacaoTutoria.findMany({
        where: { periodoId },
        include: {
          usuario: true,
          periodo: true
        },
        orderBy: { dataAtualizacao: 'desc' }
      });

      return avaliacoes.map(avaliacao => new AvaliacaoTutoria(
        avaliacao.id,
        avaliacao.usuarioId,
        avaliacao.periodoId,
        avaliacao.tipoAvaliador as 'TUTOR' | 'ALUNO',
        avaliacao.conteudo as unknown as AvaliacaoConteudo,
        avaliacao.status as StatusAvaliacao,
        avaliacao.dataEnvio,
        avaliacao.dataAtualizacao
      ));
    } catch (error: any) {
      logger.error('Erro ao buscar avaliações por período', { error: error.message, periodoId });
      throw new Error('Erro ao buscar avaliações por período');
    }
  }

  async findByTipoAvaliador(tipo: 'TUTOR' | 'ALUNO'): Promise<AvaliacaoTutoria[]> {
    try {
      const avaliacoes = await this.prisma.avaliacaoTutoria.findMany({
        where: { tipoAvaliador: tipo },
        include: {
          usuario: true,
          periodo: true
        },
        orderBy: { dataAtualizacao: 'desc' }
      });

      return avaliacoes.map(avaliacao => new AvaliacaoTutoria(
        avaliacao.id,
        avaliacao.usuarioId,
        avaliacao.periodoId,
        avaliacao.tipoAvaliador as 'TUTOR' | 'ALUNO',
        avaliacao.conteudo as unknown as AvaliacaoConteudo,
        avaliacao.status as StatusAvaliacao,
        avaliacao.dataEnvio,
        avaliacao.dataAtualizacao
      ));
    } catch (error: any) {
      logger.error('Erro ao buscar avaliações por tipo', { error: error.message, tipo });
      throw new Error('Erro ao buscar avaliações por tipo');
    }
  }

  async findAll(): Promise<AvaliacaoTutoria[]> {
    try {
      const avaliacoes = await this.prisma.avaliacaoTutoria.findMany({
        include: {
          usuario: true,
          periodo: true
        },
        orderBy: { dataAtualizacao: 'desc' }
      });

      return avaliacoes.map(avaliacao => new AvaliacaoTutoria(
        avaliacao.id,
        avaliacao.usuarioId,
        avaliacao.periodoId,
        avaliacao.tipoAvaliador as 'TUTOR' | 'ALUNO',
        avaliacao.conteudo as unknown as AvaliacaoConteudo,
        avaliacao.status as StatusAvaliacao,
        avaliacao.dataEnvio,
        avaliacao.dataAtualizacao
      ));
    } catch (error: any) {
      logger.error('Erro ao buscar todas as avaliações', { error: error.message });
      throw new Error('Erro ao buscar todas as avaliações');
    }
  }

  async update(avaliacao: AvaliacaoTutoria): Promise<void> {
    try {
      await this.prisma.avaliacaoTutoria.update({
        where: { id: avaliacao.id },
        data: {
          conteudo: avaliacao.conteudo as any,
          status: avaliacao.status,
          dataAtualizacao: avaliacao.dataAtualizacao
        }
      });
    } catch (error: any) {
      logger.error('Erro ao atualizar avaliação de tutoria', { error: error.message, avaliacaoId: avaliacao.id });
      throw new Error('Erro ao atualizar avaliação de tutoria');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.avaliacaoTutoria.delete({
        where: { id }
      });
    } catch (error: any) {
      logger.error('Erro ao deletar avaliação de tutoria', { error: error.message, id });
      throw new Error('Erro ao deletar avaliação de tutoria');
    }
  }
}
