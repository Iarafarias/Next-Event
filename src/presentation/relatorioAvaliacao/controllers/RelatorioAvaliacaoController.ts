import { Request, Response } from 'express';
import { CreateRelatorioAvaliacaoUseCase } from '../../../application/relatorioAvaliacao/use-cases/CreateRelatorioAvaliacaoUseCase';
import { UpdateRelatorioAvaliacaoUseCase } from '../../../application/relatorioAvaliacao/use-cases/UpdateRelatorioAvaliacaoUseCase';
import { GetRelatorioAvaliacaoByIdUseCase } from '../../../application/relatorioAvaliacao/use-cases/GetRelatorioAvaliacaoByIdUseCase';
import { ListRelatorioAvaliacoesUseCase } from '../../../application/relatorioAvaliacao/use-cases/ListRelatorioAvaliacoesUseCase';
import { DeleteRelatorioAvaliacaoUseCase } from '../../../application/relatorioAvaliacao/use-cases/DeleteRelatorioAvaliacaoUseCase';

export class RelatorioAvaliacaoController {
  constructor(
    private createUseCase: CreateRelatorioAvaliacaoUseCase,
    private updateUseCase: UpdateRelatorioAvaliacaoUseCase,
    private getByIdUseCase: GetRelatorioAvaliacaoByIdUseCase,
    private listUseCase: ListRelatorioAvaliacoesUseCase,
    private deleteUseCase: DeleteRelatorioAvaliacaoUseCase
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
    if (!result) return res.status(404).json({ message: 'Não encontrado' });
    res.json(result);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.getByIdUseCase.execute(id);
    if (!result) return res.status(404).json({ message: 'Não encontrado' });
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
