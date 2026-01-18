import { Request, Response } from 'express';
import { CreateRelatorioTutorUseCase } from '../../../application/relatorioTutor/use-cases/CreateRelatorioTutorUseCase';
import { UpdateRelatorioTutorUseCase } from '../../../application/relatorioTutor/use-cases/UpdateRelatorioTutorUseCase';
import { GetRelatorioTutorByIdUseCase } from '../../../application/relatorioTutor/use-cases/GetRelatorioTutorByIdUseCase';
import { ListRelatorioTutoresUseCase } from '../../../application/relatorioTutor/use-cases/ListRelatorioTutoresUseCase';
import { DeleteRelatorioTutorUseCase } from '../../../application/relatorioTutor/use-cases/DeleteRelatorioTutorUseCase';

export class RelatorioTutorController {
  constructor(
    private createUseCase: CreateRelatorioTutorUseCase,
    private updateUseCase: UpdateRelatorioTutorUseCase,
    private getByIdUseCase: GetRelatorioTutorByIdUseCase,
    private listUseCase: ListRelatorioTutoresUseCase,
    private deleteUseCase: DeleteRelatorioTutorUseCase
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
