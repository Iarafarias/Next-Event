import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { RelatorioCertificadoController } from '../controllers/RelatorioCertificadoController';
import { PostgresRelatorioCertificadoRepository } from '../../../infrastructure/relatorioCertificado/repositories/PostgresRelatorioCertificadoRepository';
import { CreateRelatorioCertificadoUseCase } from '../../../application/relatorioCertificado/use-cases/CreateRelatorioCertificadoUseCase';
import { UpdateRelatorioCertificadoUseCase } from '../../../application/relatorioCertificado/use-cases/UpdateRelatorioCertificadoUseCase';
import { GetRelatorioCertificadoByIdUseCase } from '../../../application/relatorioCertificado/use-cases/GetRelatorioCertificadoByIdUseCase';
import { ListRelatorioCertificadosUseCase } from '../../../application/relatorioCertificado/use-cases/ListRelatorioCertificadosUseCase';
import { DeleteRelatorioCertificadoUseCase } from '../../../application/relatorioCertificado/use-cases/DeleteRelatorioCertificadoUseCase';

const relatorioCertificadoRepository = new PostgresRelatorioCertificadoRepository();

const relatorioCertificadoController = new RelatorioCertificadoController(
  new CreateRelatorioCertificadoUseCase(relatorioCertificadoRepository),
  new UpdateRelatorioCertificadoUseCase(relatorioCertificadoRepository),
  new GetRelatorioCertificadoByIdUseCase(relatorioCertificadoRepository),
  new ListRelatorioCertificadosUseCase(relatorioCertificadoRepository),
  new DeleteRelatorioCertificadoUseCase(relatorioCertificadoRepository)
);

const relatorioCertificadoRoutes = Router();

relatorioCertificadoRoutes.post('/', (req: Request, res: Response) => relatorioCertificadoController.create(req, res));
relatorioCertificadoRoutes.put('/:id', (req: Request, res: Response) => relatorioCertificadoController.update(req, res));
relatorioCertificadoRoutes.get('/:id', [param('id').isString().notEmpty(), validationMiddleware], (req: Request, res: Response) => relatorioCertificadoController.getById(req, res));
relatorioCertificadoRoutes.get('/', (req: Request, res: Response) => relatorioCertificadoController.list(req, res));
relatorioCertificadoRoutes.delete('/:id', (req: Request, res: Response) => relatorioCertificadoController.delete(req, res));

export { relatorioCertificadoRoutes };
