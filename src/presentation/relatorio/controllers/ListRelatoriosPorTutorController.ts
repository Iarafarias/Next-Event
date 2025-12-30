import { Request, Response } from 'express';
import { ListRelatoriosPorTutorUseCase } from '../../../application/relatorio/use-cases/ListRelatoriosPorTutorUseCase';

export class ListRelatoriosPorTutorController {
  constructor(private useCase: ListRelatoriosPorTutorUseCase) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const relatorios = await this.useCase.execute(id);
    res.json(relatorios);
  }
}
