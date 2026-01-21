import { Aluno } from '../../aluno/entities/Aluno';

export interface ITutorRepository {
  findAlunosByTutorId(tutorId: string): Promise<Aluno[]>;
  findTutorByUsuarioId(usuarioId: string): Promise<{ id: string; usuarioId: string } | null>;
}
