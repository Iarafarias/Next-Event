import { Request, Response } from 'express';
import { ListCertificadosPorTutorUseCase } from '../../../application/certificate/use-cases/ListCertificadosPorTutorUseCase';

export class ListCertificadosPorTutorController {
  constructor(private useCase: ListCertificadosPorTutorUseCase) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const certificados = await this.useCase.execute(id);
    res.json(certificados);
  }
}
