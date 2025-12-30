import { Request, Response } from 'express';
import { CreateAlocarTutorAlunoUseCase } from '../../../application/alocarTutorAluno/use-cases/CreateAlocarTutorAlunoUseCase';
import { UpdateAlocarTutorAlunoUseCase } from '../../../application/alocarTutorAluno/use-cases/UpdateAlocarTutorAlunoUseCase';
import { GetAlocarTutorAlunoByIdUseCase } from '../../../application/alocarTutorAluno/use-cases/GetAlocarTutorAlunoByIdUseCase';
import { ListAlocacoesTutorAlunoUseCase } from '../../../application/alocarTutorAluno/use-cases/ListAlocacoesTutorAlunoUseCase';
import { DeleteAlocarTutorAlunoUseCase } from '../../../application/alocarTutorAluno/use-cases/DeleteAlocarTutorAlunoUseCase';

export class AlocarTutorAlunoController {
  constructor(
    private createUseCase: CreateAlocarTutorAlunoUseCase,
    private updateUseCase: UpdateAlocarTutorAlunoUseCase,
    private getByIdUseCase: GetAlocarTutorAlunoByIdUseCase,
    private listUseCase: ListAlocacoesTutorAlunoUseCase,
    private deleteUseCase: DeleteAlocarTutorAlunoUseCase
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
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json(result);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.getByIdUseCase.execute(id);
    if (!result) return res.status(404).json({ message: 'Not found' });
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
