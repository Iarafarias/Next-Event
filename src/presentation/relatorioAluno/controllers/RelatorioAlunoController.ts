import { Request, Response } from 'express';
import { CreateRelatorioAlunoUseCase } from '../../../application/relatorioAluno/use-cases/CreateRelatorioAlunoUseCase';
import { UpdateRelatorioAlunoUseCase } from '../../../application/relatorioAluno/use-cases/UpdateRelatorioAlunoUseCase';
import { GetRelatorioAlunoByIdUseCase } from '../../../application/relatorioAluno/use-cases/GetRelatorioAlunoByIdUseCase';
import { ListRelatorioAlunosUseCase } from '../../../application/relatorioAluno/use-cases/ListRelatorioAlunosUseCase';
import { DeleteRelatorioAlunoUseCase } from '../../../application/relatorioAluno/use-cases/DeleteRelatorioAlunoUseCase';

export class RelatorioAlunoController {
  constructor(
    private createUseCase: CreateRelatorioAlunoUseCase,
    private updateUseCase: UpdateRelatorioAlunoUseCase,
    private getByIdUseCase: GetRelatorioAlunoByIdUseCase,
    private listUseCase: ListRelatorioAlunosUseCase,
    private deleteUseCase: DeleteRelatorioAlunoUseCase
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
