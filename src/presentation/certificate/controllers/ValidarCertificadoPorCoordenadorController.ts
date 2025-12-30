import { Request, Response } from 'express';
import { ValidarCertificadoPorCoordenadorUseCase } from '../../../application/certificate/use-cases/ValidarCertificadoPorCoordenadorUseCase';

export class ValidarCertificadoPorCoordenadorController {
  constructor(private useCase: ValidarCertificadoPorCoordenadorUseCase) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { certificadoId, aprovado, comentarios } = req.body;
    await this.useCase.execute(certificadoId, id, aprovado, comentarios);
    res.status(204).send();
  }
}
