import crypto from 'node:crypto';
export enum TipoAcessoAluno {
  ACESSO_TUTOR = 'ACESSO_TUTOR',
  ACESSO_BOLSISTA = 'ACESSO_BOLSISTA'
}

export class Aluno {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly cursoId: string,
    public readonly matricula: string,
    public readonly tipoAcesso: TipoAcessoAluno,
    public readonly anoIngresso?: number,
    public readonly semestre?: number,
    public readonly ativo?: boolean,
    public readonly criadoEm?: Date,
    public readonly atualizadoEm?: Date
  ) { }

  public static create(data: {
    id?: string;
    usuarioId: string;
    cursoId: string;
    matricula: string;
    tipoAcesso: TipoAcessoAluno;
    anoIngresso?: number;
    semestre?: number;
    ativo?: boolean;
  }): Aluno {
    return new Aluno(
      data.id || crypto.randomUUID(),
      data.usuarioId,
      data.cursoId,
      data.matricula,
      data.tipoAcesso,
      data.anoIngresso,
      data.semestre || 1,
      data.ativo !== undefined ? data.ativo : true,
      new Date(),
      new Date()
    );
  }

  public isAtivo(): boolean {
    return this.ativo === true;
  }

  public acessaComoTutor(): boolean {
    return this.tipoAcesso === TipoAcessoAluno.ACESSO_TUTOR;
  }

  public acessaComoBolsista(): boolean {
    return this.tipoAcesso === TipoAcessoAluno.ACESSO_BOLSISTA;
  }
}