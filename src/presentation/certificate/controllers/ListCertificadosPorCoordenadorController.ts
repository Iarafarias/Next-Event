import { Request, Response } from 'express';
import { ListCertificadosPorCoordenadorUseCase } from '../../../application/certificate/use-cases/ListCertificadosPorCoordenadorUseCase';

export class ListCertificadosPorCoordenadorController {
  constructor(private useCase: ListCertificadosPorCoordenadorUseCase) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const certificados = await this.useCase.execute(id);
    res.json(certificados);
  }
}
