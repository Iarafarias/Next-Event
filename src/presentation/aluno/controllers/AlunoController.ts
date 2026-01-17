import { Request, Response } from 'express';
import { ListAlunosUseCase } from '../../../application/aluno/use-cases/ListAlunosUseCase';
import { GetAlunoByIdUseCase } from '../../../application/aluno/use-cases/GetAlunoByIdUseCase';
import { UpdateAlunoUseCase } from '../../../application/aluno/use-cases/UpdateAlunoUseCase';

export class AlunoController {
    constructor(
        private listAlunosUseCase: ListAlunosUseCase,
        private getAlunoByIdUseCase: GetAlunoByIdUseCase,
        private updateAlunoUseCase: UpdateAlunoUseCase
    ) { }

    async list(req: Request, res: Response): Promise<void> {
        try {
            const { cursoId, role } = req.query;
            const filters: any = {};

            if (cursoId) filters.cursoId = cursoId as string;
            if (role) filters.role = role as string;

            const alunos = await this.listAlunosUseCase.execute(filters);
            res.status(200).json(alunos);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const aluno = await this.getAlunoByIdUseCase.execute(req.params.id);
            res.status(200).json(aluno);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const aluno = await this.updateAlunoUseCase.execute({
                id: req.params.id,
                ...req.body
            });
            res.status(200).json(aluno);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
