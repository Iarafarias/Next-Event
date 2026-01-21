import { Request, Response } from 'express';
import { ListAlunosByTutorUseCase } from '../../../application/user/use-cases/ListAlunosByTutorUseCase';
import logger from '../../../infrastructure/logger/logger';

export class TutorController {
  constructor(
    private listAlunosByTutorUseCase: ListAlunosByTutorUseCase
  ) {}

  async listMyAlunos(req: Request, res: Response): Promise<Response> {
    try {
      const tutorUsuarioId = (req as any).user.userId;
      
      logger.info('GET /tutores/meus-alunos - Listar alunos do tutor', {
        tutorUsuarioId
      });

      const alunos = await this.listAlunosByTutorUseCase.execute({
        tutorUsuarioId
      });

      return res.json({
        message: 'Alunos do tutor listados com sucesso',
        data: alunos,
        total: alunos.length
      });
    } catch (error: any) {
      logger.error('Erro ao listar alunos do tutor', { 
        error: error.message,
        tutorUsuarioId: (req as any).user?.userId 
      });
      
      if (error.message === 'Tutor não encontrado') {
        return res.status(404).json({ error: 'Tutor não encontrado' });
      }
      
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listAlunos(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      logger.info('GET /tutores/:id/alunos - Listar alunos de tutor específico', {
        tutorId: id
      });

      // Para esta rota, usamos o id do tutor diretamente
      // Primeiro precisamos buscar o usuarioId do tutor
      const alunos = await this.listAlunosByTutorUseCase.execute({
        tutorUsuarioId: id
      });

      return res.json({
        message: 'Alunos do tutor listados com sucesso',
        data: alunos,
        total: alunos.length
      });
    } catch (error: any) {
      logger.error('Erro ao listar alunos do tutor', { 
        error: error.message,
        tutorId: req.params.id 
      });
      
      if (error.message === 'Tutor não encontrado') {
        return res.status(404).json({ error: 'Tutor não encontrado' });
      }
      
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
