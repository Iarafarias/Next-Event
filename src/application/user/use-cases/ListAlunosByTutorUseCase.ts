import { ITutorRepository } from '../../../domain/user/repositories/ITutorRepository';
import { Aluno } from '../../../domain/aluno/entities/Aluno';
import logger from '../../../infrastructure/logger/logger';

export interface ListAlunosByTutorRequest {
  tutorUsuarioId: string;
}

export class ListAlunosByTutorUseCase {
  constructor(
    private tutorRepository: ITutorRepository
  ) {}

  async execute(request: ListAlunosByTutorRequest): Promise<Aluno[]> {
    try {
      logger.info('Executando ListAlunosByTutorUseCase', { tutorUsuarioId: request.tutorUsuarioId });

      // Buscar tutor pelo usuarioId
      const tutor = await this.tutorRepository.findTutorByUsuarioId(request.tutorUsuarioId);
      if (!tutor) {
        throw new Error('Tutor não encontrado');
      }

      // Buscar alunos alocados para este tutor
      const alunos = await this.tutorRepository.findAlunosByTutorId(tutor.id);
      
      logger.info('Alunos encontrados para tutor', { 
        tutorId: tutor.id, 
        quantidadeAlunos: alunos.length 
      });

      return alunos;
    } catch (error: any) {
      logger.error('Erro ao listar alunos do tutor', { 
        error: error.message, 
        tutorUsuarioId: request.tutorUsuarioId 
      });
      throw error;
    }
  }
}
