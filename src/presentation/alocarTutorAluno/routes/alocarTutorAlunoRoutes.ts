import { Router } from 'express';
import { AlocarTutorAlunoController } from '../controllers/AlocarTutorAlunoController';
import { PostgresAlocarTutorAlunoRepository } from '../../../infrastructure/alocarTutorAluno/repositories/PostgresAlocarTutorAlunoRepository';
import { CreateAlocarTutorAlunoUseCase } from '../../../application/alocarTutorAluno/use-cases/CreateAlocarTutorAlunoUseCase';
import { UpdateAlocarTutorAlunoUseCase } from '../../../application/alocarTutorAluno/use-cases/UpdateAlocarTutorAlunoUseCase';
import { GetAlocarTutorAlunoByIdUseCase } from '../../../application/alocarTutorAluno/use-cases/GetAlocarTutorAlunoByIdUseCase';
import { ListAlocacoesTutorAlunoUseCase } from '../../../application/alocarTutorAluno/use-cases/ListAlocacoesTutorAlunoUseCase';
import { DeleteAlocarTutorAlunoUseCase } from '../../../application/alocarTutorAluno/use-cases/DeleteAlocarTutorAlunoUseCase';

const alocarTutorAlunoRepository = new PostgresAlocarTutorAlunoRepository();

const alocarTutorAlunoController = new AlocarTutorAlunoController(
  new CreateAlocarTutorAlunoUseCase(alocarTutorAlunoRepository),
  new UpdateAlocarTutorAlunoUseCase(alocarTutorAlunoRepository),
  new GetAlocarTutorAlunoByIdUseCase(alocarTutorAlunoRepository),
  new ListAlocacoesTutorAlunoUseCase(alocarTutorAlunoRepository),
  new DeleteAlocarTutorAlunoUseCase(alocarTutorAlunoRepository)
);

const alocarTutorAlunoRoutes = Router();

alocarTutorAlunoRoutes.post('/', (req, res) => alocarTutorAlunoController.create(req, res));
alocarTutorAlunoRoutes.put('/:id', (req, res) => alocarTutorAlunoController.update(req, res));
alocarTutorAlunoRoutes.get('/:id', (req, res) => alocarTutorAlunoController.getById(req, res));
alocarTutorAlunoRoutes.get('/', (req, res) => alocarTutorAlunoController.list(req, res));
alocarTutorAlunoRoutes.delete('/:id', (req, res) => alocarTutorAlunoController.delete(req, res));

export { alocarTutorAlunoRoutes };
