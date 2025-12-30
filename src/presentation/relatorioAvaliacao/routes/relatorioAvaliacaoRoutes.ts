import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { RelatorioAvaliacaoController } from '../controllers/RelatorioAvaliacaoController';
import { PostgresRelatorioAvaliacaoRepository } from '../../../infrastructure/relatorioAvaliacao/repositories/PostgresRelatorioAvaliacaoRepository';
import { CreateRelatorioAvaliacaoUseCase } from '../../../application/relatorioAvaliacao/use-cases/CreateRelatorioAvaliacaoUseCase';
import { UpdateRelatorioAvaliacaoUseCase } from '../../../application/relatorioAvaliacao/use-cases/UpdateRelatorioAvaliacaoUseCase';
import { GetRelatorioAvaliacaoByIdUseCase } from '../../../application/relatorioAvaliacao/use-cases/GetRelatorioAvaliacaoByIdUseCase';
import { ListRelatorioAvaliacoesUseCase } from '../../../application/relatorioAvaliacao/use-cases/ListRelatorioAvaliacoesUseCase';
import { DeleteRelatorioAvaliacaoUseCase } from '../../../application/relatorioAvaliacao/use-cases/DeleteRelatorioAvaliacaoUseCase';

const relatorioAvaliacaoRepository = new PostgresRelatorioAvaliacaoRepository();

const relatorioAvaliacaoController = new RelatorioAvaliacaoController(
  new CreateRelatorioAvaliacaoUseCase(relatorioAvaliacaoRepository),
  new UpdateRelatorioAvaliacaoUseCase(relatorioAvaliacaoRepository),
  new GetRelatorioAvaliacaoByIdUseCase(relatorioAvaliacaoRepository),
  new ListRelatorioAvaliacoesUseCase(relatorioAvaliacaoRepository),
  new DeleteRelatorioAvaliacaoUseCase(relatorioAvaliacaoRepository)
);

const relatorioAvaliacaoRoutes = Router();

relatorioAvaliacaoRoutes.post('/', (req: Request, res: Response) => relatorioAvaliacaoController.create(req, res));
relatorioAvaliacaoRoutes.put('/:id', (req: Request, res: Response) => relatorioAvaliacaoController.update(req, res));
relatorioAvaliacaoRoutes.get('/:id', [param('id').isString().notEmpty(), validationMiddleware], (req: Request, res: Response) => relatorioAvaliacaoController.getById(req, res));
relatorioAvaliacaoRoutes.get('/', (req: Request, res: Response) => relatorioAvaliacaoController.list(req, res));
relatorioAvaliacaoRoutes.delete('/:id', (req: Request, res: Response) => relatorioAvaliacaoController.delete(req, res));

export { relatorioAvaliacaoRoutes };
