import { Request, Response } from 'express';
import { SolicitarCertificadoPorBolsistaUseCase } from '../../../application/certificate/use-cases/SolicitarCertificadoPorBolsistaUseCase';

export class SolicitarCertificadoPorBolsistaController {
  constructor(private useCase: SolicitarCertificadoPorBolsistaUseCase) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const certificado = await this.useCase.execute(id, req.body);
    res.status(201).json(certificado);
  }
}
