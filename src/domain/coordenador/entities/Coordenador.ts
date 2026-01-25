import crypto from 'node:crypto';
export class Coordenador {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly cursoId: string,
    public readonly area?: string,
    public readonly nivel?: string,
    public readonly criadoEm?: Date,
    public readonly atualizadoEm?: Date
  ) { }

  public static create(data: {
    id?: string;
    usuarioId: string;
    cursoId: string;
    area?: string;
    nivel?: string;
  }): Coordenador {
    return new Coordenador(
      data.id || crypto.randomUUID(),
      data.usuarioId,
      data.cursoId,
      data.area,
      data.nivel,
      new Date(),
      new Date()
    );
  }
}