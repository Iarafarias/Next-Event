import { Request, Response } from 'express';
import { ListTutoresUseCase } from '../../../application/user/use-cases/ListTutoresUseCase';

export class ListTutoresController {
  constructor(private listTutoresUseCase: ListTutoresUseCase) {}

  async handle(req: Request, res: Response) {
    const tutores = await this.listTutoresUseCase.execute();
    res.json(tutores);
  }
}
