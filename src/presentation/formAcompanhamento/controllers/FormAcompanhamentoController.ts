import { Request, Response } from 'express';
import { CreateFormAcompanhamentoUseCase } from '../../../application/formAcompanhamento/use-cases/CreateFormAcompanhamentoUseCase';
import { UpdateFormAcompanhamentoUseCase } from '../../../application/formAcompanhamento/use-cases/UpdateFormAcompanhamentoUseCase';
import { GetFormAcompanhamentoByIdUseCase } from '../../../application/formAcompanhamento/use-cases/GetFormAcompanhamentoByIdUseCase';
import { ListFormAcompanhamentosUseCase } from '../../../application/formAcompanhamento/use-cases/ListFormAcompanhamentosUseCase';
import { DeleteFormAcompanhamentoUseCase } from '../../../application/formAcompanhamento/use-cases/DeleteFormAcompanhamentoUseCase';
import logger from '../../../infrastructure/logger/logger';

export class FormAcompanhamentoController {
  constructor(
    private createUseCase: CreateFormAcompanhamentoUseCase,
    private updateUseCase: UpdateFormAcompanhamentoUseCase,
    private getByIdUseCase: GetFormAcompanhamentoByIdUseCase,
    private listUseCase: ListFormAcompanhamentosUseCase,
    private deleteUseCase: DeleteFormAcompanhamentoUseCase
  ) { }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const {
        tutorId,
        bolsistaId,
        periodoId,
        modalidadeReuniao,

        maiorDificuldadeAluno,
        quantidadeReunioes,
        quantidadeVirtuais,
        quantidadePresenciais,
        descricaoDificuldade,
        observacoes
      } = req.body;


      logger.info('POST /form-acompanhamento - Criar formulário', {
        tutorId,
        bolsistaId,
        periodoId
      });

      // Validações
      if (!tutorId || !bolsistaId || !periodoId) {
        return res.status(400).json({
          error: 'Campos obrigatórios: tutorId, bolsistaId, periodoId'
        });
      }

      if (!modalidadeReuniao || !['VIRTUAL', 'PRESENCIAL'].includes(modalidadeReuniao)) {
        return res.status(400).json({
          error: 'Modalidade da reunião deve ser: VIRTUAL ou PRESENCIAL'
        });
      }

      if (!maiorDificuldadeAluno) {
        return res.status(400).json({
          error: 'Maior dificuldade do aluno é obrigatória'
        });
      }

      if (quantidadeReunioes === undefined || quantidadeReunioes < 0) {
        return res.status(400).json({
          error: 'Quantidade de reuniões deve ser um número positivo'
        });
      }

      if (!descricaoDificuldade) {
        return res.status(400).json({
          error: 'Descrição da dificuldade é obrigatória'
        });
      }

      const data = {
        tutorId,
        bolsistaId,
        periodoId,
        modalidadeReuniao,
        maiorDificuldadeAluno,
        quantidadeReunioes,
        quantidadeVirtuais: Number(quantidadeVirtuais) || 0,
        quantidadePresenciais: Number(quantidadePresenciais) || 0,
        descricaoDificuldade,
        observacoes
      };


      const result = await this.createUseCase.execute(data);

      return res.status(201).json({
        message: 'Formulário de acompanhamento criado com sucesso',
        data: result
      });
    } catch (error: any) {
      logger.error('Erro ao criar formulário de acompanhamento', { error: error.message });
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data = req.body;

      logger.info('PUT /form-acompanhamento/:id - Atualizar formulário', { id });

      const result = await this.updateUseCase.execute(id, data);

      if (!result) {
        return res.status(404).json({ error: 'Formulário não encontrado' });
      }

      return res.json({
        message: 'Formulário de acompanhamento atualizado com sucesso',
        data: result
      });
    } catch (error: any) {
      logger.error('Erro ao atualizar formulário de acompanhamento', { error: error.message, id: req.params.id });
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      logger.info('GET /form-acompanhamento/:id - Buscar formulário', { id });

      const result = await this.getByIdUseCase.execute(id);

      if (!result) {
        return res.status(404).json({ error: 'Formulário não encontrado' });
      }

      return res.json({
        message: 'Formulário encontrado com sucesso',
        data: result
      });
    } catch (error: any) {
      logger.error('Erro ao buscar formulário de acompanhamento', { error: error.message, id: req.params.id });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      const { tutorId, bolsistaId, periodoId } = req.query;

      logger.info('GET /form-acompanhamento - Listar formulários', {
        tutorId, bolsistaId, periodoId
      });

      const result = await this.listUseCase.execute({
        tutorId: tutorId as string,
        bolsistaId: bolsistaId as string,
        periodoId: periodoId as string
      });


      return res.json({
        message: 'Formulários listados com sucesso',
        data: result,
        total: result.length
      });
    } catch (error: any) {
      logger.error('Erro ao listar formulários de acompanhamento', { error: error.message });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      logger.info('DELETE /form-acompanhamento/:id - Deletar formulário', { id });

      await this.deleteUseCase.execute(id);

      return res.status(204).send();
    } catch (error: any) {
      logger.error('Erro ao deletar formulário de acompanhamento', { error: error.message, id: req.params.id });
      return res.status(400).json({ error: error.message });
    }
  }
}
