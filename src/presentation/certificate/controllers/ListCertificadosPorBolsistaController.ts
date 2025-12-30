import { Request, Response } from 'express';
import { ListCertificadosPorBolsistaUseCase } from '../../../application/certificate/use-cases/ListCertificadosPorBolsistaUseCase';

export class ListCertificadosPorBolsistaController {
  constructor(private useCase: ListCertificadosPorBolsistaUseCase) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const certificados = await this.useCase.execute(id);
    res.json(certificados);
  }
}
