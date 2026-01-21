import { AvaliacaoTutoria } from '../entities/AvaliacaoTutoria';

export interface IAvaliacaoTutoriaRepository {
  save(avaliacao: AvaliacaoTutoria): Promise<void>;
  findById(id: string): Promise<AvaliacaoTutoria | null>;
  findByUsuarioId(usuarioId: string): Promise<AvaliacaoTutoria[]>;
  findByPeriodoId(periodoId: string): Promise<AvaliacaoTutoria[]>;
  findByTipoAvaliador(tipo: 'TUTOR' | 'ALUNO'): Promise<AvaliacaoTutoria[]>;
  findAll(): Promise<AvaliacaoTutoria[]>;
  update(avaliacao: AvaliacaoTutoria): Promise<void>;
  delete(id: string): Promise<void>;
}
