import { IAvaliacaoTutoriaRepository } from '../../../domain/avaliacaoTutoria/repositories/IAvaliacaoTutoriaRepository';
import { AvaliacaoTutoria } from '../../../domain/avaliacaoTutoria/entities/AvaliacaoTutoria';
import logger from '../../../infrastructure/logger/logger';

export interface ListAvaliacoesTutoriaRequest {
  usuarioId?: string;
  periodoId?: string;
  tipoAvaliador?: 'TUTOR' | 'ALUNO';
}

export class ListAvaliacoesTutoriaUseCase {
  constructor(
    private avaliacaoTutoriaRepository: IAvaliacaoTutoriaRepository
  ) {}

  async execute(filters: ListAvaliacoesTutoriaRequest = {}): Promise<AvaliacaoTutoria[]> {
    try {
      logger.info('Listando avaliações de tutoria', filters);

      let avaliacoes: AvaliacaoTutoria[];

      if (filters.usuarioId) {
        avaliacoes = await this.avaliacaoTutoriaRepository.findByUsuarioId(filters.usuarioId);
      } else if (filters.periodoId) {
        avaliacoes = await this.avaliacaoTutoriaRepository.findByPeriodoId(filters.periodoId);
      } else if (filters.tipoAvaliador) {
        avaliacoes = await this.avaliacaoTutoriaRepository.findByTipoAvaliador(filters.tipoAvaliador);
      } else {
        avaliacoes = await this.avaliacaoTutoriaRepository.findAll();
      }

      logger.info('Avaliações de tutoria encontradas', { 
        quantidade: avaliacoes.length,
        filtros: filters 
      });

      return avaliacoes;
    } catch (error: any) {
      logger.error('Erro ao listar avaliações de tutoria', { 
        error: error.message,
        filtros: filters 
      });
      throw error;
    }
  }
}
