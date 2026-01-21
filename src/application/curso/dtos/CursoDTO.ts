export interface CreateCursoDTO {
  nome: string;
  codigo: string;
  descricao?: string;
  ativo?: boolean;
}

export interface UpdateCursoDTO {
  nome?: string;
  codigo?: string;
  descricao?: string;
  ativo?: boolean;
}

export interface CursoResponseDTO {
  id: string;
  nome: string;
  codigo: string;
  descricao?: string;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
  // Contadores úteis
  totalAlunos?: number;
  alunosTutores?: number;
  alunosBolsistas?: number;
}