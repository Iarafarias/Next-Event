import { Router } from 'express';
import { PeriodoTutoriaController } from '../controllers/PeriodoTutoriaController';
import { PostgresPeriodoTutoriaRepository } from '../../../infrastructure/periodoTutoria/repositories/PostgresPeriodoTutoriaRepository';
import { CreatePeriodoTutoriaUseCase } from '../../../application/periodoTutoria/use-cases/CreatePeriodoTutoriaUseCase';
import { UpdatePeriodoTutoriaUseCase } from '../../../application/periodoTutoria/use-cases/UpdatePeriodoTutoriaUseCase';
import { GetPeriodoTutoriaByIdUseCase } from '../../../application/periodoTutoria/use-cases/GetPeriodoTutoriaByIdUseCase';
import { ListPeriodosTutoriaUseCase } from '../../../application/periodoTutoria/use-cases/ListPeriodosTutoriaUseCase';
import { DeletePeriodoTutoriaUseCase } from '../../../application/periodoTutoria/use-cases/DeletePeriodoTutoriaUseCase';

const periodoTutoriaRepository = new PostgresPeriodoTutoriaRepository();

const periodoTutoriaController = new PeriodoTutoriaController(
  new CreatePeriodoTutoriaUseCase(periodoTutoriaRepository),
  new UpdatePeriodoTutoriaUseCase(periodoTutoriaRepository),
  new GetPeriodoTutoriaByIdUseCase(periodoTutoriaRepository),
  new ListPeriodosTutoriaUseCase(periodoTutoriaRepository),
  new DeletePeriodoTutoriaUseCase(periodoTutoriaRepository)
);

const periodoTutoriaRoutes = Router();

periodoTutoriaRoutes.post('/', (req, res) => periodoTutoriaController.create(req, res));
periodoTutoriaRoutes.put('/:id', (req, res) => periodoTutoriaController.update(req, res));
periodoTutoriaRoutes.get('/:id', (req, res) => periodoTutoriaController.getById(req, res));
periodoTutoriaRoutes.get('/', (req, res) => periodoTutoriaController.list(req, res));
periodoTutoriaRoutes.delete('/:id', (req, res) => periodoTutoriaController.delete(req, res));

export { periodoTutoriaRoutes };
