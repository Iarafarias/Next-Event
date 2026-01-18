import { Request, Response } from 'express';
import { CreateCargaHorariaMinimaUseCase } from '../../../application/cargaHorariaMinima/use-cases/CreateCargaHorariaMinimaUseCase';
import { UpdateCargaHorariaMinimaUseCase } from '../../../application/cargaHorariaMinima/use-cases/UpdateCargaHorariaMinimaUseCase';
import { GetCargaHorariaMinimaByIdUseCase } from '../../../application/cargaHorariaMinima/use-cases/GetCargaHorariaMinimaByIdUseCase';
import { ListCargaHorariaMinimaUseCase } from '../../../application/cargaHorariaMinima/use-cases/ListCargaHorariaMinimaUseCase';
import { DeleteCargaHorariaMinimaUseCase } from '../../../application/cargaHorariaMinima/use-cases/DeleteCargaHorariaMinimaUseCase';

export class CargaHorariaMinimaController {
  constructor(
    private createUseCase: CreateCargaHorariaMinimaUseCase,
    private updateUseCase: UpdateCargaHorariaMinimaUseCase,
    private getByIdUseCase: GetCargaHorariaMinimaByIdUseCase,
    private listUseCase: ListCargaHorariaMinimaUseCase,
    private deleteUseCase: DeleteCargaHorariaMinimaUseCase
  ) {}

  async create(req: Request, res: Response) {
    const data = req.body;
    const carga = await this.createUseCase.execute(data);
    res.status(201).json(carga);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    const carga = await this.updateUseCase.execute(id, data);
    if (!carga) return res.status(404).json({ message: 'Não encontrado' });
    res.json(carga);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const carga = await this.getByIdUseCase.execute(id);
    if (!carga) return res.status(404).json({ message: 'Não encontrado' });
    res.json(carga);
  }

  async list(req: Request, res: Response) {
    const cargas = await this.listUseCase.execute();
    res.json(cargas);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.deleteUseCase.execute(id);
    res.status(204).send();
  }
}
