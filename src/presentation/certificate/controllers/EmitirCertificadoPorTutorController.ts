import { Request, Response } from 'express';
import { EmitirCertificadoPorTutorUseCase } from '../../../application/certificate/use-cases/EmitirCertificadoPorTutorUseCase';

export class EmitirCertificadoPorTutorController {
  constructor(private useCase: EmitirCertificadoPorTutorUseCase) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const certificado = await this.useCase.execute(id, req.body);
    res.status(201).json(certificado);
  }
}
