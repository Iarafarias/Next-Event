import { Request, Response } from 'express';
import { GetRelatorioIndividualAlunoUseCase } from '../../../application/relatorio/use-cases/GetRelatorioIndividualAlunoUseCase';
import { GetRelatorioIndividualTutorUseCase } from '../../../application/relatorio/use-cases/GetRelatorioIndividualTutorUseCase';

export class RelatorioIndividualController {
    constructor(
        private getRelatorioIndividualAlunoUseCase: GetRelatorioIndividualAlunoUseCase,
        private getRelatorioIndividualTutorUseCase: GetRelatorioIndividualTutorUseCase
    ) { }

    async getAlunoReport(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const report = await this.getRelatorioIndividualAlunoUseCase.execute(id);
            return res.json(report);
        } catch (err: any) {
            return res.status(404).json({ error: err.message });
        }
    }

    async getTutorReport(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const report = await this.getRelatorioIndividualTutorUseCase.execute(id);
            return res.json(report);
        } catch (err: any) {
            return res.status(404).json({ error: err.message });
        }
    }
}
