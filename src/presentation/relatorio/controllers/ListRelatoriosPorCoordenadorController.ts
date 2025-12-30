import { Request, Response } from 'express';
import { ListRelatoriosPorCoordenadorUseCase } from '../../../application/relatorio/use-cases/ListRelatoriosPorCoordenadorUseCase';

export class ListRelatoriosPorCoordenadorController {
  constructor(private useCase: ListRelatoriosPorCoordenadorUseCase) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const relatorios = await this.useCase.execute(id);
    res.json(relatorios);
  }
}
