import { IAvaliacaoTutoriaRepository } from '../../../domain/avaliacaoTutoria/repositories/IAvaliacaoTutoriaRepository';
import { AvaliacaoTutoria, AvaliacaoConteudo } from '../../../domain/avaliacaoTutoria/entities/AvaliacaoTutoria';
import { CreateAvaliacaoTutoriaDTO } from '../dtos/CreateAvaliacaoTutoriaDTO';
import logger from '../../../infrastructure/logger/logger';

export class CreateAvaliacaoTutoriaUseCase {
  constructor(
    private avaliacaoTutoriaRepository: IAvaliacaoTutoriaRepository
  ) { }

  async execute(data: CreateAvaliacaoTutoriaDTO): Promise<AvaliacaoTutoria> {
    try {
      logger.info('Criando avaliação de tutoria', {
        usuarioId: data.usuarioId,
        periodoId: data.periodoId,
        tipoAvaliador: data.tipoAvaliador
      });

      const conteudo: AvaliacaoConteudo = {
        experiencia: {
          aspectosPositivos: data.aspectosPositivos,
          aspectosNegativos: data.aspectosNegativos,
          sugestoesMelhorias: data.sugestoesMelhorias,
          comentarioGeral: data.comentarioGeral
        },
        dificuldades: {
          dificuldadesComunicacao: data.dificuldadesComunicacao,
          dificuldadesConteudo: data.dificuldadesConteudo,
          dificuldadesMetodologicas: data.dificuldadesMetodologicas,
          dificuldadesRecursos: data.dificuldadesRecursos,
          outrasDificuldades: data.outrasDificuldades
        },
        nivelSatisfacaoGeral: data.nivelSatisfacaoGeral,
        recomendariaPrograma: data.recomendariaPrograma,
        justificativaRecomendacao: data.justificativaRecomendacao,
        dataPreenchimento: new Date(),
        nomeAvaliador: '', // Será preenchido pelo repository
        periodoAvaliado: data.periodoAvaliado || '' // Será preenchido pelo repository se vazio
      };


      const avaliacao = AvaliacaoTutoria.create(
        data.usuarioId,
        data.periodoId,
        data.tipoAvaliador,
        conteudo
      );

      await this.avaliacaoTutoriaRepository.save(avaliacao);

      logger.info('Avaliação de tutoria criada com sucesso', { avaliacaoId: avaliacao.id });

      return avaliacao;
    } catch (error: any) {
      logger.error('Erro ao criar avaliação de tutoria', {
        error: error.message,
        usuarioId: data.usuarioId
      });
      throw error;
    }
  }
}
