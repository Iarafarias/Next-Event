import { Router } from 'express';
import { FormAcompanhamentoController } from '../controllers/FormAcompanhamentoController';
import { PostgresFormAcompanhamentoRepository } from '../../../infrastructure/formAcompanhamento/repositories/PostgresFormAcompanhamentoRepository';
import { CreateFormAcompanhamentoUseCase } from '../../../application/formAcompanhamento/use-cases/CreateFormAcompanhamentoUseCase';
import { UpdateFormAcompanhamentoUseCase } from '../../../application/formAcompanhamento/use-cases/UpdateFormAcompanhamentoUseCase';
import { GetFormAcompanhamentoByIdUseCase } from '../../../application/formAcompanhamento/use-cases/GetFormAcompanhamentoByIdUseCase';
import { ListFormAcompanhamentosUseCase } from '../../../application/formAcompanhamento/use-cases/ListFormAcompanhamentosUseCase';
import { DeleteFormAcompanhamentoUseCase } from '../../../application/formAcompanhamento/use-cases/DeleteFormAcompanhamentoUseCase';

const formAcompanhamentoRepository = new PostgresFormAcompanhamentoRepository();

const formAcompanhamentoController = new FormAcompanhamentoController(
  new CreateFormAcompanhamentoUseCase(formAcompanhamentoRepository),
  new UpdateFormAcompanhamentoUseCase(formAcompanhamentoRepository),
  new GetFormAcompanhamentoByIdUseCase(formAcompanhamentoRepository),
  new ListFormAcompanhamentosUseCase(formAcompanhamentoRepository),
  new DeleteFormAcompanhamentoUseCase(formAcompanhamentoRepository)
);

const formAcompanhamentoRoutes = Router();

formAcompanhamentoRoutes.post('/', (req, res) => formAcompanhamentoController.create(req, res));
formAcompanhamentoRoutes.put('/:id', (req, res) => formAcompanhamentoController.update(req, res));
formAcompanhamentoRoutes.get('/:id', (req, res) => formAcompanhamentoController.getById(req, res));
formAcompanhamentoRoutes.get('/', (req, res) => formAcompanhamentoController.list(req, res));
formAcompanhamentoRoutes.delete('/:id', (req, res) => formAcompanhamentoController.delete(req, res));

export { formAcompanhamentoRoutes };
