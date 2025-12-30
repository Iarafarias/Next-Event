import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { RelatorioAlunoController } from '../controllers/RelatorioAlunoController';
import { PostgresRelatorioAlunoRepository } from '../../../infrastructure/relatorioAluno/repositories/PostgresRelatorioAlunoRepository';
import { CreateRelatorioAlunoUseCase } from '../../../application/relatorioAluno/use-cases/CreateRelatorioAlunoUseCase';
import { UpdateRelatorioAlunoUseCase } from '../../../application/relatorioAluno/use-cases/UpdateRelatorioAlunoUseCase';
import { GetRelatorioAlunoByIdUseCase } from '../../../application/relatorioAluno/use-cases/GetRelatorioAlunoByIdUseCase';
import { ListRelatorioAlunosUseCase } from '../../../application/relatorioAluno/use-cases/ListRelatorioAlunosUseCase';
import { DeleteRelatorioAlunoUseCase } from '../../../application/relatorioAluno/use-cases/DeleteRelatorioAlunoUseCase';

const relatorioAlunoRepository = new PostgresRelatorioAlunoRepository();

const relatorioAlunoController = new RelatorioAlunoController(
  new CreateRelatorioAlunoUseCase(relatorioAlunoRepository),
  new UpdateRelatorioAlunoUseCase(relatorioAlunoRepository),
  new GetRelatorioAlunoByIdUseCase(relatorioAlunoRepository),
  new ListRelatorioAlunosUseCase(relatorioAlunoRepository),
  new DeleteRelatorioAlunoUseCase(relatorioAlunoRepository)
);

const relatorioAlunoRoutes = Router();

relatorioAlunoRoutes.post('/', (req: Request, res: Response) => relatorioAlunoController.create(req, res));
relatorioAlunoRoutes.put('/:id', (req: Request, res: Response) => relatorioAlunoController.update(req, res));
relatorioAlunoRoutes.get('/:id', [param('id').isString().notEmpty(), validationMiddleware], (req: Request, res: Response) => relatorioAlunoController.getById(req, res));
relatorioAlunoRoutes.get('/', (req: Request, res: Response) => relatorioAlunoController.list(req, res));
relatorioAlunoRoutes.delete('/:id', (req: Request, res: Response) => relatorioAlunoController.delete(req, res));

export { relatorioAlunoRoutes };
