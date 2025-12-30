import { Request, Response } from 'express';
import { ListBolsistasUseCase } from '../../../application/user/use-cases/ListBolsistasUseCase';

export class ListBolsistasController {
  constructor(private listBolsistasUseCase: ListBolsistasUseCase) {}

  async handle(req: Request, res: Response) {
    const bolsistas = await this.listBolsistasUseCase.execute();
    res.json(bolsistas);
  }
}
