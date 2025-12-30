import { Request, Response } from 'express';
import { CreateRelatorioAcompanhamentoUseCase } from '../../../application/relatorioAcompanhamento/use-cases/CreateRelatorioAcompanhamentoUseCase';
import { UpdateRelatorioAcompanhamentoUseCase } from '../../../application/relatorioAcompanhamento/use-cases/UpdateRelatorioAcompanhamentoUseCase';
import { GetRelatorioAcompanhamentoByIdUseCase } from '../../../application/relatorioAcompanhamento/use-cases/GetRelatorioAcompanhamentoByIdUseCase';
import { ListRelatorioAcompanhamentosUseCase } from '../../../application/relatorioAcompanhamento/use-cases/ListRelatorioAcompanhamentosUseCase';
import { DeleteRelatorioAcompanhamentoUseCase } from '../../../application/relatorioAcompanhamento/use-cases/DeleteRelatorioAcompanhamentoUseCase';

export class RelatorioAcompanhamentoController {
  constructor(
    private createUseCase: CreateRelatorioAcompanhamentoUseCase,
    private updateUseCase: UpdateRelatorioAcompanhamentoUseCase,
    private getByIdUseCase: GetRelatorioAcompanhamentoByIdUseCase,
    private listUseCase: ListRelatorioAcompanhamentosUseCase,
    private deleteUseCase: DeleteRelatorioAcompanhamentoUseCase
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
