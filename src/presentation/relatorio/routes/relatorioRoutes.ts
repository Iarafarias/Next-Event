import { Router } from 'express';
import { RelatorioController } from '../controllers/RelatorioController';
import { PostgresRelatorioRepository } from '../../../infrastructure/relatorio/repositories/postgresRelatorioRepository';
import { CreateRelatorioUseCase } from '../../../application/relatorio/use-cases/CreateRelatorioUseCase';
import { UpdateRelatorioUseCase } from '../../../application/relatorio/use-cases/UpdateRelatorioUseCase';
import { GetRelatorioByIdUseCase } from '../../../application/relatorio/use-cases/GetRelatorioByIdUseCase';
import { ListRelatoriosUseCase } from '../../../application/relatorio/use-cases/ListRelatoriosUseCase';
import { DeleteRelatorioUseCase } from '../../../application/relatorio/use-cases/DeleteRelatorioUseCase';
import { ListRelatoriosPorCoordenadorUseCase } from '../../../application/relatorio/use-cases/ListRelatoriosPorCoordenadorUseCase';
import { ListRelatoriosPorTutorUseCase } from '../../../application/relatorio/use-cases/ListRelatoriosPorTutorUseCase';
import { ListRelatoriosPorBolsistaUseCase } from '../../../application/relatorio/use-cases/ListRelatoriosPorBolsistaUseCase';
import { ListRelatoriosPorCoordenadorController } from '../controllers/ListRelatoriosPorCoordenadorController';
import { ListRelatoriosPorTutorController } from '../controllers/ListRelatoriosPorTutorController';
import { ListRelatoriosPorBolsistaController } from '../controllers/ListRelatoriosPorBolsistaController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { authorizeRoles } from '../../middlewares/authorizeRoles';
import { param } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validationMiddleware';

const relatorioRoutes = Router();

// Inicializar repositório, use-cases e controllers
const relatorioRepository = new PostgresRelatorioRepository();

const listRelatoriosPorCoordenadorUseCase = new ListRelatoriosPorCoordenadorUseCase(relatorioRepository);
const listRelatoriosPorTutorUseCase = new ListRelatoriosPorTutorUseCase(relatorioRepository);
const listRelatoriosPorBolsistaUseCase = new ListRelatoriosPorBolsistaUseCase(relatorioRepository);

const listRelatoriosPorCoordenadorController = new ListRelatoriosPorCoordenadorController(listRelatoriosPorCoordenadorUseCase);
const listRelatoriosPorTutorController = new ListRelatoriosPorTutorController(listRelatoriosPorTutorUseCase);
const listRelatoriosPorBolsistaController = new ListRelatoriosPorBolsistaController(listRelatoriosPorBolsistaUseCase);

const relatorioController = new RelatorioController(
  new CreateRelatorioUseCase(relatorioRepository),
  new UpdateRelatorioUseCase(relatorioRepository),
  new GetRelatorioByIdUseCase(relatorioRepository),
  new ListRelatoriosUseCase(relatorioRepository),
  new DeleteRelatorioUseCase(relatorioRepository)
);

// Rotas para listar relatórios por responsável (não duplicar 'relatorios' no path)
relatorioRoutes.get(
  '/coordenadores/:id',
  authMiddleware,
  authorizeRoles(['coordinator', 'admin']),
  [param('id').isString().notEmpty(), validationMiddleware],
  (req: import('express').Request, res: import('express').Response) => listRelatoriosPorCoordenadorController.handle(req, res)
);
relatorioRoutes.get(
  '/tutores/:id',
  authMiddleware,
  authorizeRoles(['tutor', 'admin']),
  [param('id').isString().notEmpty(), validationMiddleware],
  (req: import('express').Request, res: import('express').Response) => listRelatoriosPorTutorController.handle(req, res)
);
relatorioRoutes.get(
  '/bolsistas/:id',
  authMiddleware,
  authorizeRoles(['scholarship_holder', 'admin']),
  [param('id').isString().notEmpty(), validationMiddleware],
  (req: import('express').Request, res: import('express').Response) => listRelatoriosPorBolsistaController.handle(req, res)
);

// Rotas CRUD para relatórios
relatorioRoutes.post('/', authMiddleware, authorizeRoles(['admin']), (req: import('express').Request, res: import('express').Response) => relatorioController.create(req, res));
relatorioRoutes.put('/:id', authMiddleware, authorizeRoles(['admin']), (req: import('express').Request, res: import('express').Response) => relatorioController.update(req, res));
relatorioRoutes.get('/:id', authMiddleware, (req: import('express').Request, res: import('express').Response) => relatorioController.getById(req, res));
relatorioRoutes.get('/', authMiddleware, authorizeRoles(['admin']), (req: import('express').Request, res: import('express').Response) => relatorioController.list(req, res));
relatorioRoutes.delete('/:id', authMiddleware, authorizeRoles(['admin']), (req: import('express').Request, res: import('express').Response) => relatorioController.delete(req, res));

export { relatorioRoutes };
