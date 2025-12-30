import { Request, Response } from 'express';
import { ListCoordenadoresUseCase } from '../../../application/user/use-cases/ListCoordenadoresUseCase';

export class ListCoordenadoresController {
  constructor(private listCoordenadoresUseCase: ListCoordenadoresUseCase) {}

  async handle(req: Request, res: Response) {
    const coordenadores = await this.listCoordenadoresUseCase.execute();
    res.json(coordenadores);
  }
}
