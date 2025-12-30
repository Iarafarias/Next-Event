
export interface CreateUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  status?: 'ATIVO' | 'INATIVO' | 'PENDENTE';
  coordenador?: {
    area?: string;
    nivel?: string;
  };
  tutor?: {
    area?: string;
    nivel?: string;
    capacidadeMaxima?: number;
  };
  bolsista?: {
    anoIngresso?: number;
    curso?: string;
  };
}
