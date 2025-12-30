import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { RelatorioAcompanhamentoController } from '../controllers/RelatorioAcompanhamentoController';
import { PostgresRelatorioAcompanhamentoRepository } from '../../../infrastructure/relatorioAcompanhamento/repositories/PostgresRelatorioAcompanhamentoRepository';
import { CreateRelatorioAcompanhamentoUseCase } from '../../../application/relatorioAcompanhamento/use-cases/CreateRelatorioAcompanhamentoUseCase';
import { UpdateRelatorioAcompanhamentoUseCase } from '../../../application/relatorioAcompanhamento/use-cases/UpdateRelatorioAcompanhamentoUseCase';
import { GetRelatorioAcompanhamentoByIdUseCase } from '../../../application/relatorioAcompanhamento/use-cases/GetRelatorioAcompanhamentoByIdUseCase';
import { ListRelatorioAcompanhamentosUseCase } from '../../../application/relatorioAcompanhamento/use-cases/ListRelatorioAcompanhamentosUseCase';
import { DeleteRelatorioAcompanhamentoUseCase } from '../../../application/relatorioAcompanhamento/use-cases/DeleteRelatorioAcompanhamentoUseCase';

const relatorioAcompanhamentoRepository = new PostgresRelatorioAcompanhamentoRepository();

const relatorioAcompanhamentoController = new RelatorioAcompanhamentoController(
  new CreateRelatorioAcompanhamentoUseCase(relatorioAcompanhamentoRepository),
  new UpdateRelatorioAcompanhamentoUseCase(relatorioAcompanhamentoRepository),
  new GetRelatorioAcompanhamentoByIdUseCase(relatorioAcompanhamentoRepository),
  new ListRelatorioAcompanhamentosUseCase(relatorioAcompanhamentoRepository),
  new DeleteRelatorioAcompanhamentoUseCase(relatorioAcompanhamentoRepository)
);

const relatorioAcompanhamentoRoutes = Router();

relatorioAcompanhamentoRoutes.post('/', (req: Request, res: Response) => relatorioAcompanhamentoController.create(req, res));
relatorioAcompanhamentoRoutes.put('/:id', (req: Request, res: Response) => relatorioAcompanhamentoController.update(req, res));
relatorioAcompanhamentoRoutes.get('/:id', [param('id').isString().notEmpty(), validationMiddleware], (req: Request, res: Response) => relatorioAcompanhamentoController.getById(req, res));
relatorioAcompanhamentoRoutes.get('/', (req: Request, res: Response) => relatorioAcompanhamentoController.list(req, res));
relatorioAcompanhamentoRoutes.delete('/:id', (req: Request, res: Response) => relatorioAcompanhamentoController.delete(req, res));

export { relatorioAcompanhamentoRoutes };
