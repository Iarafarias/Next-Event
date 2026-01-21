import { IAvaliacaoTutoriaRepository } from '../../../domain/avaliacaoTutoria/repositories/IAvaliacaoTutoriaRepository';
import { AvaliacaoTutoria, AvaliacaoConteudo } from '../../../domain/avaliacaoTutoria/entities/AvaliacaoTutoria';
import { UpdateAvaliacaoTutoriaDTO } from '../dtos/CreateAvaliacaoTutoriaDTO';
import logger from '../../../infrastructure/logger/logger';

export class UpdateAvaliacaoTutoriaUseCase {
  constructor(
    private avaliacaoTutoriaRepository: IAvaliacaoTutoriaRepository
  ) {}

  async execute(id: string, data: UpdateAvaliacaoTutoriaDTO): Promise<AvaliacaoTutoria | null> {
    try {
      logger.info('Atualizando avaliação de tutoria', { avaliacaoId: id });

      const avaliacao = await this.avaliacaoTutoriaRepository.findById(id);
      
      if (!avaliacao) {
        logger.warn('Avaliação de tutoria não encontrada', { avaliacaoId: id });
        return null;
      }

      if (!avaliacao.podeEditar()) {
        throw new Error('Avaliação não pode ser editada no status atual');
      }

      // Atualizar conteúdo
      const novoConteudo: AvaliacaoConteudo = {
        ...avaliacao.conteudo,
        experiencia: {
          ...avaliacao.conteudo.experiencia,
          ...(data.aspectosPositivos && { aspectosPositivos: data.aspectosPositivos }),
          ...(data.aspectosNegativos && { aspectosNegativos: data.aspectosNegativos }),
          ...(data.sugestoesMelhorias && { sugestoesMelhorias: data.sugestoesMelhorias }),
          ...(data.comentarioGeral && { comentarioGeral: data.comentarioGeral })
        },
        dificuldades: {
          ...avaliacao.conteudo.dificuldades,
          ...(data.dificuldadesComunicacao && { dificuldadesComunicacao: data.dificuldadesComunicacao }),
          ...(data.dificuldadesConteudo && { dificuldadesConteudo: data.dificuldadesConteudo }),
          ...(data.dificuldadesMetodologicas && { dificuldadesMetodologicas: data.dificuldadesMetodologicas }),
          ...(data.dificuldadesRecursos && { dificuldadesRecursos: data.dificuldadesRecursos }),
          ...(data.outrasDificuldades !== undefined && { outrasDificuldades: data.outrasDificuldades })
        },
        ...(data.nivelSatisfacaoGeral && { nivelSatisfacaoGeral: data.nivelSatisfacaoGeral }),
        ...(data.recomendariaPrograma !== undefined && { recomendariaPrograma: data.recomendariaPrograma }),
        ...(data.justificativaRecomendacao && { justificativaRecomendacao: data.justificativaRecomendacao })
      };

      const avaliacaoAtualizada = new AvaliacaoTutoria(
        avaliacao.id,
        avaliacao.usuarioId,
        avaliacao.periodoId,
        avaliacao.tipoAvaliador,
        novoConteudo,
        avaliacao.status,
        avaliacao.dataEnvio,
        new Date()
      );

      await this.avaliacaoTutoriaRepository.update(avaliacaoAtualizada);
      
      logger.info('Avaliação de tutoria atualizada com sucesso', { avaliacaoId: id });
      
      return avaliacaoAtualizada;
    } catch (error: any) {
      logger.error('Erro ao atualizar avaliação de tutoria', { 
        error: error.message, 
        avaliacaoId: id 
      });
      throw error;
    }
  }
}
