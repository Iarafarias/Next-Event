import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { RelatorioTutorController } from '../controllers/RelatorioTutorController';
import { PostgresRelatorioTutorRepository } from '../../../infrastructure/relatorioTutor/repositories/PostgresRelatorioTutorRepository';
import { CreateRelatorioTutorUseCase } from '../../../application/relatorioTutor/use-cases/CreateRelatorioTutorUseCase';
import { UpdateRelatorioTutorUseCase } from '../../../application/relatorioTutor/use-cases/UpdateRelatorioTutorUseCase';
import { GetRelatorioTutorByIdUseCase } from '../../../application/relatorioTutor/use-cases/GetRelatorioTutorByIdUseCase';
import { ListRelatorioTutoresUseCase } from '../../../application/relatorioTutor/use-cases/ListRelatorioTutoresUseCase';
import { DeleteRelatorioTutorUseCase } from '../../../application/relatorioTutor/use-cases/DeleteRelatorioTutorUseCase';

const relatorioTutorRepository = new PostgresRelatorioTutorRepository();

const relatorioTutorController = new RelatorioTutorController(
  new CreateRelatorioTutorUseCase(relatorioTutorRepository),
  new UpdateRelatorioTutorUseCase(relatorioTutorRepository),
  new GetRelatorioTutorByIdUseCase(relatorioTutorRepository),
  new ListRelatorioTutoresUseCase(relatorioTutorRepository),
  new DeleteRelatorioTutorUseCase(relatorioTutorRepository)
);

const relatorioTutorRoutes = Router();

relatorioTutorRoutes.post('/', (req: Request, res: Response) => relatorioTutorController.create(req, res));
relatorioTutorRoutes.put('/:id', (req: Request, res: Response) => relatorioTutorController.update(req, res));
relatorioTutorRoutes.get('/:id', [param('id').isString().notEmpty(), validationMiddleware], (req: Request, res: Response) => relatorioTutorController.getById(req, res));
relatorioTutorRoutes.get('/', (req: Request, res: Response) => relatorioTutorController.list(req, res));
relatorioTutorRoutes.delete('/:id', (req: Request, res: Response) => relatorioTutorController.delete(req, res));

export { relatorioTutorRoutes };
