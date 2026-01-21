import { Request, Response } from 'express';
import { CreateCursoUseCase } from '../../../application/curso/use-cases/CreateCursoUseCase';
import { ListCursosUseCase } from '../../../application/curso/use-cases/ListCursosUseCase';
import logger from '../../../infrastructure/logger/logger';

export class CursoController {
  constructor(
    private createCursoUseCase: CreateCursoUseCase,
    private listCursosUseCase: ListCursosUseCase
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { nome, codigo, descricao, ativo } = req.body;

      logger.info('POST /cursos - Criar curso', {
        body: { nome, codigo, descricao, ativo }
      });

      if (!nome || !codigo) {
        return res.status(400).json({
          error: 'Campos obrigatórios: nome, codigo'
        });
      }

      await this.createCursoUseCase.execute({
        nome,
        codigo,
        descricao,
        ativo
      });

      return res.status(201).json({ message: 'Curso criado com sucesso' });
    } catch (error: any) {
      logger.error('Erro ao criar curso', { error: error.message });
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      logger.info('GET /cursos - Listar cursos');
      
      const cursos = await this.listCursosUseCase.execute();
      return res.json(cursos);
    } catch (error: any) {
      logger.error('Erro ao listar cursos', { error: error.message });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}