import { Request, Response } from 'express';
import { CreateAlunoUseCase } from '../../../application/aluno/use-cases/CreateAlunoUseCase';
import { ListAlunosUseCase } from '../../../application/aluno/use-cases/ListAlunosUseCase';
import { ListAlunosTutoresUseCase } from '../../../application/aluno/use-cases/ListAlunosTutoresUseCase';
import { ListAlunosBolsistasUseCase } from '../../../application/aluno/use-cases/ListAlunosBolsistasUseCase';
// import { TipoAcessoAluno } from '../../../domain/aluno/entities/Aluno';
import logger from '../../../infrastructure/logger/logger';

// Definição temporária do enum
enum TipoAcessoAluno {
  ACESSO_TUTOR = 'ACESSO_TUTOR',
  ACESSO_BOLSISTA = 'ACESSO_BOLSISTA'
}

export class AlunoController {
  constructor(
    private createAlunoUseCase: CreateAlunoUseCase,
    private listAlunosUseCase: ListAlunosUseCase,
    private listAlunosTutoresUseCase: ListAlunosTutoresUseCase,
    private listAlunosBolsistasUseCase: ListAlunosBolsistasUseCase
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { usuarioId, cursoId, matricula, tipo, anoIngresso, semestre } = req.body;

      logger.info('POST /alunos - Criar aluno', {
        body: { usuarioId, cursoId, matricula, tipo, anoIngresso, semestre }
      });

      if (!usuarioId || !cursoId || !matricula || !tipo) {
        return res.status(400).json({
          error: 'Campos obrigatórios: usuarioId, cursoId, matricula, tipo'
        });
      }

      // Validar tipo
      if (!Object.values(TipoAcessoAluno).includes(tipo)) {
        return res.status(400).json({
          error: 'Tipo deve ser: ACESSO_TUTOR ou ACESSO_BOLSISTA'
        });
      }

      await this.createAlunoUseCase.execute({
        usuarioId,
        cursoId,
        matricula,
        tipoAcesso: tipo,
        anoIngresso,
        semestre
      });

      return res.status(201).json({ message: 'Aluno criado com sucesso' });
    } catch (error: any) {
      logger.error('Erro ao criar aluno', { error: error.message });
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req: Request, res: Response): Promise<Response> {
    try {
      logger.info('GET /alunos - Listar alunos');
      
      const alunos = await this.listAlunosUseCase.execute();
      return res.json(alunos);
    } catch (error: any) {
      logger.error('Erro ao listar alunos', { error: error.message });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listTutores(req: Request, res: Response): Promise<Response> {
    try {
      logger.info('GET /alunos/tutores - Listar alunos tutores');
      
      const alunos = await this.listAlunosTutoresUseCase.execute();
      return res.json(alunos);
    } catch (error: any) {
      logger.error('Erro ao listar alunos tutores', { error: error.message });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listBolsistas(req: Request, res: Response): Promise<Response> {
    try {
      logger.info('GET /alunos/bolsistas - Listar alunos bolsistas');
      
      const alunos = await this.listAlunosBolsistasUseCase.execute();
      return res.json(alunos);
    } catch (error: any) {
      logger.error('Erro ao listar alunos bolsistas', { error: error.message });
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}