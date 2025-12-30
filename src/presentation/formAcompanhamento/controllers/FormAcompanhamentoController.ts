import { Request, Response } from 'express';
import { CreateFormAcompanhamentoUseCase } from '../../../application/formAcompanhamento/use-cases/CreateFormAcompanhamentoUseCase';
import { UpdateFormAcompanhamentoUseCase } from '../../../application/formAcompanhamento/use-cases/UpdateFormAcompanhamentoUseCase';
import { GetFormAcompanhamentoByIdUseCase } from '../../../application/formAcompanhamento/use-cases/GetFormAcompanhamentoByIdUseCase';
import { ListFormAcompanhamentosUseCase } from '../../../application/formAcompanhamento/use-cases/ListFormAcompanhamentosUseCase';
import { DeleteFormAcompanhamentoUseCase } from '../../../application/formAcompanhamento/use-cases/DeleteFormAcompanhamentoUseCase';

export class FormAcompanhamentoController {
  constructor(
    private createUseCase: CreateFormAcompanhamentoUseCase,
    private updateUseCase: UpdateFormAcompanhamentoUseCase,
    private getByIdUseCase: GetFormAcompanhamentoByIdUseCase,
    private listUseCase: ListFormAcompanhamentosUseCase,
    private deleteUseCase: DeleteFormAcompanhamentoUseCase
  ) {}

  async create(req: Request, res: Response) {
    const data = req.body;
    const result = await this.createUseCase.execute(data);
    res.status(201).json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    const result = await this.updateUseCase.execute(id, data);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json(result);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.getByIdUseCase.execute(id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json(result);
  }

  async list(req: Request, res: Response) {
    const result = await this.listUseCase.execute();
    res.json(result);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.deleteUseCase.execute(id);
    res.status(204).send();
  }
}
