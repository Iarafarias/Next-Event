import { Request, Response } from 'express';
import { CreateCursoUseCase } from '../../../application/curso/use-cases/CreateCursoUseCase';
import { ListCursosUseCase } from '../../../application/curso/use-cases/ListCursosUseCase';
import { GetCursoByIdUseCase } from '../../../application/curso/use-cases/GetCursoByIdUseCase';
import { UpdateCursoUseCase } from '../../../application/curso/use-cases/UpdateCursoUseCase';
import { DeleteCursoUseCase } from '../../../application/curso/use-cases/DeleteCursoUseCase';

export class CursoController {
    constructor(
        private createCursoUseCase: CreateCursoUseCase,
        private listCursosUseCase: ListCursosUseCase,
        private getCursoByIdUseCase: GetCursoByIdUseCase,
        private updateCursoUseCase: UpdateCursoUseCase,
        private deleteCursoUseCase: DeleteCursoUseCase
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const curso = await this.createCursoUseCase.execute(req.body);
            res.status(201).json(curso);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async list(req: Request, res: Response): Promise<void> {
        try {
            const cursos = await this.listCursosUseCase.execute();
            res.status(200).json(cursos);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const curso = await this.getCursoByIdUseCase.execute(req.params.id);
            res.status(200).json(curso);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const curso = await this.updateCursoUseCase.execute({
                id: req.params.id,
                ...req.body
            });
            res.status(200).json(curso);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            await this.deleteCursoUseCase.execute(req.params.id);
            res.status(204).send();
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
