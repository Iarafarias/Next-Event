import crypto from 'node:crypto';
export type UsuarioStatus = 'ATIVO' | 'INATIVO' | 'PENDENTE';
export type UsuarioRole = 'COORDENADOR' | 'TUTOR' | 'BOLSISTA';

export class Usuario {
  id!: string;
  nome!: string;
  email!: string;
  senha!: string;
  status!: UsuarioStatus;
  criadoEm!: Date;
  atualizadoEm!: Date;

  // Perfis
  coordenador?: Coordenador;
  tutor?: Tutor;
  bolsista?: Bolsista;

  constructor(props: Omit<Usuario, 'id' | 'criadoEm' | 'atualizadoEm'>) {
    Object.assign(this, {
      ...props,
      id: crypto.randomUUID(),
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    });
  }
}

export class Coordenador {
  id!: string;
  usuarioId!: string;
  area?: string;
  nivel?: string;
}

export class Tutor {
  id!: string;
  usuarioId!: string;
  area?: string;
  nivel?: string;
  capacidadeMaxima!: number;
}

export class Bolsista {
  id!: string;
  usuarioId!: string;
  anoIngresso?: number;
  curso?: string;
}
