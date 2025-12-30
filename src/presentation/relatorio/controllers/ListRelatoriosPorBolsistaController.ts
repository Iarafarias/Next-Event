import { Request, Response } from 'express';
import { ListRelatoriosPorBolsistaUseCase } from '../../../application/relatorio/use-cases/ListRelatoriosPorBolsistaUseCase';

export class ListRelatoriosPorBolsistaController {
  constructor(private useCase: ListRelatoriosPorBolsistaUseCase) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const relatorios = await this.useCase.execute(id);
    res.json(relatorios);
  }
}
