import { TipoAcessoAluno } from '../../../domain/aluno/entities/Aluno';

export interface CreateAlunoDTO {
  usuarioId: string;
  cursoId: string;
  matricula: string;
  tipoAcesso: TipoAcessoAluno;
  anoIngresso?: number;
  semestre?: number;
}

export interface UpdateAlunoDTO {
  cursoId?: string;
  matricula?: string;
  tipoAcesso?: TipoAcessoAluno;
  anoIngresso?: number;
  semestre?: number;
  ativo?: boolean;
}

export interface AlunoResponseDTO {
  id: string;
  usuarioId: string;
  cursoId: string;
  matricula: string;
  tipoAcesso: TipoAcessoAluno;
  anoIngresso?: number;
  semestre?: number;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
  // Dados aninhados
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
  curso?: {
    id: string;
    nome: string;
    codigo: string;
  };
}