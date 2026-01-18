import { Request, Response } from 'express';
import { CreatePeriodoTutoriaUseCase } from '../../../application/periodoTutoria/use-cases/CreatePeriodoTutoriaUseCase';
import { UpdatePeriodoTutoriaUseCase } from '../../../application/periodoTutoria/use-cases/UpdatePeriodoTutoriaUseCase';
import { GetPeriodoTutoriaByIdUseCase } from '../../../application/periodoTutoria/use-cases/GetPeriodoTutoriaByIdUseCase';
import { ListPeriodosTutoriaUseCase } from '../../../application/periodoTutoria/use-cases/ListPeriodosTutoriaUseCase';
import { DeletePeriodoTutoriaUseCase } from '../../../application/periodoTutoria/use-cases/DeletePeriodoTutoriaUseCase';

export class PeriodoTutoriaController {
  constructor(
    private createUseCase: CreatePeriodoTutoriaUseCase,
    private updateUseCase: UpdatePeriodoTutoriaUseCase,
    private getByIdUseCase: GetPeriodoTutoriaByIdUseCase,
    private listUseCase: ListPeriodosTutoriaUseCase,
    private deleteUseCase: DeletePeriodoTutoriaUseCase
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
