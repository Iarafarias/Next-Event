import { Request, Response } from 'express';
import { CreateRelatorioUseCase } from '../../../application/relatorio/use-cases/CreateRelatorioUseCase';
import { UpdateRelatorioUseCase } from '../../../application/relatorio/use-cases/UpdateRelatorioUseCase';
import { GetRelatorioByIdUseCase } from '../../../application/relatorio/use-cases/GetRelatorioByIdUseCase';
import { ListRelatoriosUseCase } from '../../../application/relatorio/use-cases/ListRelatoriosUseCase';
import { DeleteRelatorioUseCase } from '../../../application/relatorio/use-cases/DeleteRelatorioUseCase';

export class RelatorioController {
  constructor(
    private createRelatorioUseCase: CreateRelatorioUseCase,
    private updateRelatorioUseCase: UpdateRelatorioUseCase,
    private getRelatorioByIdUseCase: GetRelatorioByIdUseCase,
    private listRelatoriosUseCase: ListRelatoriosUseCase,
    private deleteRelatorioUseCase: DeleteRelatorioUseCase
  ) { }

  async create(req: Request, res: Response) {
    try {
      const relatorio = await this.createRelatorioUseCase.execute(req.body);
      return res.status(201).json(relatorio);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const relatorio = await this.updateRelatorioUseCase.execute({ ...req.body, id: req.params.id });
      return res.json(relatorio);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const relatorio = await this.getRelatorioByIdUseCase.execute(req.params.id);
      if (!relatorio) return res.status(404).json({ error: 'Relatório não encontrado' });
      return res.json(relatorio);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const relatorios = await this.listRelatoriosUseCase.execute();
      return res.json(relatorios);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.deleteRelatorioUseCase.execute(req.params.id);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
