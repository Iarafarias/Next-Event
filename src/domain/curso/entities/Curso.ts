export class Curso {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly codigo: string,
    public readonly descricao?: string,
    public readonly ativo?: boolean,
    public readonly criadoEm?: Date,
    public readonly atualizadoEm?: Date
  ) {}

  public static create(data: {
    id?: string;
    nome: string;
    codigo: string;
    descricao?: string;
    ativo?: boolean;
  }): Curso {
    return new Curso(
      data.id || crypto.randomUUID(),
      data.nome,
      data.codigo,
      data.descricao,
      data.ativo !== undefined ? data.ativo : true,
      new Date(),
      new Date()
    );
  }

  public isAtivo(): boolean {
    return this.ativo === true;
  }
}