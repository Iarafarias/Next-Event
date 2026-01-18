import { Request, Response } from 'express';
import { CreateRelatorioCertificadoUseCase } from '../../../application/relatorioCertificado/use-cases/CreateRelatorioCertificadoUseCase';
import { UpdateRelatorioCertificadoUseCase } from '../../../application/relatorioCertificado/use-cases/UpdateRelatorioCertificadoUseCase';
import { GetRelatorioCertificadoByIdUseCase } from '../../../application/relatorioCertificado/use-cases/GetRelatorioCertificadoByIdUseCase';
import { ListRelatorioCertificadosUseCase } from '../../../application/relatorioCertificado/use-cases/ListRelatorioCertificadosUseCase';
import { DeleteRelatorioCertificadoUseCase } from '../../../application/relatorioCertificado/use-cases/DeleteRelatorioCertificadoUseCase';

export class RelatorioCertificadoController {
  constructor(
    private createUseCase: CreateRelatorioCertificadoUseCase,
    private updateUseCase: UpdateRelatorioCertificadoUseCase,
    private getByIdUseCase: GetRelatorioCertificadoByIdUseCase,
    private listUseCase: ListRelatorioCertificadosUseCase,
    private deleteUseCase: DeleteRelatorioCertificadoUseCase
  ) {}

  async create(req: Request, res: Response) {
    const data = req.body;
    const result = await this.createUseCase.execute(data);
    res.status(201).json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body;
    const result = await this.updateUseCase.execute(id, data);
    if (!result) return res.status(404).json({ message: 'Não encontrado' });
    res.json(result);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.getByIdUseCase.execute(id);
    if (!result) return res.status(404).json({ message: 'Não encontrado' });
    res.json(result);
  }

  async list(req: Request, res: Response) {
    const result = await this.listUseCase.execute();
    res.json(result);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.deleteUseCase.execute(id);
    res.status(204).send();
  }
}
