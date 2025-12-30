import { Request, Response } from 'express';
import { AtribuirPapelUseCase } from '../../../application/user/use-cases/AtribuirPapelUseCase';
import { AtribuirPapelDTO } from '../../../application/user/dtos/AtribuirPapelDTO';

export class AtribuirPapelController {
  constructor(private useCase: AtribuirPapelUseCase) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const dto: AtribuirPapelDTO = req.body;
    await this.useCase.execute(id, dto);
    res.status(204).send();
  }
}
