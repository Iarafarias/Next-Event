export interface UsuarioResponseDTO {
  id: string;
  nome: string;
  email: string;
  status: string;
  criadoEm: Date;
  atualizadoEm: Date;
  coordenador?: {
    id: string;
    area?: string;
    nivel?: string;
  };
  tutor?: {
    id: string;
    area?: string;
    nivel?: string;
    capacidadeMaxima?: number;
  };
  bolsista?: {
    id: string;
    anoIngresso?: number;
    curso?: string;
  };
}
