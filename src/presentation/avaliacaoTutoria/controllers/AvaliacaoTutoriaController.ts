import { Request, Response } from 'express';
import { CreateAvaliacaoTutoriaUseCase } from '../../../application/avaliacaoTutoria/use-cases/CreateAvaliacaoTutoriaUseCase';
import { ListAvaliacoesTutoriaUseCase } from '../../../application/avaliacaoTutoria/use-cases/ListAvaliacoesTutoriaUseCase';
import { UpdateAvaliacaoTutoriaUseCase } from '../../../application/avaliacaoTutoria/use-cases/UpdateAvaliacaoTutoriaUseCase';
import logger from '../../../infrastructure/logger/logger';

export class AvaliacaoTutoriaController {
  constructor(
    private createUseCase: CreateAvaliacaoTutoriaUseCase,
    private listUseCase: ListAvaliacoesTutoriaUseCase,
    private updateUseCase: UpdateAvaliacaoTutoriaUseCase
  ) { }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const {
        periodoId,
        tipoAvaliador,
        aspectosPositivos,
        aspectosNegativos,
        sugestoesMelhorias,
        comentarioGeral,
        dificuldadesComunicacao,
        dificuldadesConteudo,
        dificuldadesMetodologicas,
        dificuldadesRecursos,
        outrasDificuldades,
        nivelSatisfacaoGeral,
        recomendariaPrograma,
        justificativaRecomendacao,
        periodoAvaliado
      } = req.body;


      const usuarioId = (req as any).user.id;

      logger.info('POST /avaliacao-tutoria - Criar avaliação', {
        usuarioId,
        periodoId,
        tipoAvaliador
      });

      // Validações
      if (!periodoId) {
        return res.status(400).json({ error: 'Período é obrigatório' });
      }

      if (!tipoAvaliador || !['TUTOR', 'ALUNO'].includes(tipoAvaliador)) {
        return res.status(400).json({ error: 'Tipo de avaliador deve ser: TUTOR ou ALUNO' });
      }

      if (!comentarioGeral) {
        return res.status(400).json({ error: 'Comentário geral é obrigatório' });
      }

      if (!justificativaRecomendacao) {
        return res.status(400).json({ error: 'Justificativa da recomendação é obrigatória' });
      }

      if (!['MUITO_INSATISFEITO', 'INSATISFEITO', 'NEUTRO', 'SATISFEITO', 'MUITO_SATISFEITO'].includes(nivelSatisfacaoGeral)) {
        return res.status(400).json({ error: 'Nível de satisfação inválido' });
      }

      if (typeof recomendariaPrograma !== 'boolean') {
        return res.status(400).json({ error: 'Recomendação do programa deve ser verdadeiro ou falso' });
      }

      const data = {
        usuarioId,
        periodoId,
        tipoAvaliador,
        aspectosPositivos: aspectosPositivos || [],
        aspectosNegativos: aspectosNegativos || [],
        sugestoesMelhorias: sugestoesMelhorias || [],
        comentarioGeral,
        dificuldadesComunicacao: dificuldadesComunicacao || '',
        dificuldadesConteudo: dificuldadesConteudo || '',
        dificuldadesMetodologicas: dificuldadesMetodologicas || '',
        dificuldadesRecursos: dificuldadesRecursos || '',
        outrasDificuldades,
        nivelSatisfacaoGeral,
        recomendariaPrograma,
        justificativaRecomendacao,
        periodoAvaliado
      };


      const avaliacao = await this.createUseCase.execute(data);

      return res.status(201).json({
        message: 'Avaliação de tutoria criada com sucesso',
        data: avaliacao
      });
    } catch (error: any) {
      logger.error('Erro ao criar avaliação de tutoria', { error: error.message });
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const { usuarioId, periodoId, tipoAvaliador } = req.query;

      logger.info('GET /avaliacao-tutoria - Listar avaliações', {
        filtros: { usuarioId, periodoId, tipoAvaliador }
      });

      const avaliacoes = await this.listUseCase.execute({
        usuarioId: usuarioId as string,
        periodoId: periodoId as string,
        tipoAvaliador: tipoAvaliador as 'TUTOR' | 'ALUNO'
      });

      return res.json({
        message: 'Avaliações listadas com sucesso',
        data: avaliacoes,
        total: avaliacoes.length
      });
    } catch (error: any) {
      logger.error('Erro ao listar avaliações de tutoria', { error: error.message });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listMyAvaliacoes(req: Request, res: Response): Promise<Response> {
    try {
      const usuarioId = (req as any).user.id;

      logger.info('GET /avaliaçao-tutoria/minhas - Listar minhas avaliações', { usuarioId });

      const avaliacoes = await this.listUseCase.execute({ usuarioId });

      return res.json({
        message: 'Suas avaliações listadas com sucesso',
        data: avaliacoes,
        total: avaliacoes.length
      });
    } catch (error: any) {
      logger.error('Erro ao listar minhas avaliações', { error: error.message });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;

      logger.info('PUT /avaliacao-tutoria/:id - Atualizar avaliação', { id });

      const avaliacao = await this.updateUseCase.execute(id, data);

      if (!avaliacao) {
        return res.status(404).json({ error: 'Avaliação não encontrada' });
      }

      return res.json({
        message: 'Avaliação atualizada com sucesso',
        data: avaliacao
      });
    } catch (error: any) {
      logger.error('Erro ao atualizar avaliação de tutoria', { error: error.message, id: req.params.id });
      return res.status(400).json({ error: error.message });
    }
  }
}
