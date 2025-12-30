import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { CargaHorariaMinimaController } from '../controllers/CargaHorariaMinimaController';
import { PostgresCargaHorariaMinimaRepository } from '../../../infrastructure/cargaHorariaMinima/repositories/PostgresCargaHorariaMinimaRepository';
import { CreateCargaHorariaMinimaUseCase } from '../../../application/cargaHorariaMinima/use-cases/CreateCargaHorariaMinimaUseCase';
import { UpdateCargaHorariaMinimaUseCase } from '../../../application/cargaHorariaMinima/use-cases/UpdateCargaHorariaMinimaUseCase';
import { GetCargaHorariaMinimaByIdUseCase } from '../../../application/cargaHorariaMinima/use-cases/GetCargaHorariaMinimaByIdUseCase';
import { ListCargaHorariaMinimaUseCase } from '../../../application/cargaHorariaMinima/use-cases/ListCargaHorariaMinimaUseCase';
import { DeleteCargaHorariaMinimaUseCase } from '../../../application/cargaHorariaMinima/use-cases/DeleteCargaHorariaMinimaUseCase';

const router = Router();
const repository = new PostgresCargaHorariaMinimaRepository();
const controller = new CargaHorariaMinimaController(
  new CreateCargaHorariaMinimaUseCase(repository),
  new UpdateCargaHorariaMinimaUseCase(repository),
  new GetCargaHorariaMinimaByIdUseCase(repository),
  new ListCargaHorariaMinimaUseCase(repository),
  new DeleteCargaHorariaMinimaUseCase(repository)
);

router.post(
  '/',
  [
    body('periodoId').isString().notEmpty(),
    body('categoria').isString().notEmpty(),
    body('horasMinimas').isInt({ min: 0 }),
    body('descricao').optional().isString(),
    validationMiddleware
  ],
  (req: Request, res: Response) => controller.create(req, res)
);

router.put(
  '/:id',
  [
    body('categoria').optional().isString(),
    body('horasMinimas').optional().isInt({ min: 0 }),
    body('descricao').optional().isString(),
    validationMiddleware
  ],
  (req: Request, res: Response) => controller.update(req, res)
);
router.get('/:id', (req: Request, res: Response) => controller.getById(req, res));
router.get('/', (req: Request, res: Response) => controller.list(req, res));
router.delete('/:id', (req: Request, res: Response) => controller.delete(req, res));

export default router;
