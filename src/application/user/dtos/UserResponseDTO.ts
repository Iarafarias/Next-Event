export interface UsuarioResponseDTO {
  id: string;
  nome: string;
  email: string;
  status: string;
  criadoEm: Date;
  atualizadoEm: Date;
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
