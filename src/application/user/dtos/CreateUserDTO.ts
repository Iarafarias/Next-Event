
export interface CreateUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  status?: 'ATIVO' | 'INATIVO' | 'PENDENTE';

  // Dados do perfil Aluno (base/padrão para todos os usuários)
  aluno?: {
    cursoId?: string;
    matricula?: string;
    role?: 'ALUNO' | 'TUTOR' | 'BOLSISTA' | 'TUTOR_BOLSISTA';
  };

  // Perfis adicionais (opcionais)
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
