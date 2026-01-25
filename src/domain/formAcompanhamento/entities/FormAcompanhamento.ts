import crypto from 'node:crypto';
export type ModalidadeReuniao = 'VIRTUAL' | 'PRESENCIAL';

export interface FormAcompanhamentoConteudo {
  modalidadeReuniao: ModalidadeReuniao;
  maiorDificuldadeAluno: string;
  quantidadeReunioes: number;
  descricaoDificuldade: string;
  nomeAluno: string;
  nomeTutor: string;
  dataPreenchimento: Date;
}

export class FormAcompanhamento {
  public readonly id: string;
  public readonly tutorId: string;
  public readonly bolsistaId: string;
  public readonly periodoId: string;
  public readonly conteudo: FormAcompanhamentoConteudo;
  public readonly dataEnvio: Date;
  public readonly observacoes?: string;

  constructor(
    id: string,
    tutorId: string,
    bolsistaId: string,
    periodoId: string,
    conteudo: FormAcompanhamentoConteudo,
    dataEnvio: Date,
    observacoes?: string
  ) {
    this.id = id;
    this.tutorId = tutorId;
    this.bolsistaId = bolsistaId;
    this.periodoId = periodoId;
    this.conteudo = conteudo;
    this.dataEnvio = dataEnvio;
    this.observacoes = observacoes;

    this.validate();
  }

  private validate(): void {
    if (!this.tutorId) {
      throw new Error('TutorId é obrigatório');
    }
    if (!this.bolsistaId) {
      throw new Error('BolsistaId é obrigatório');
    }
    if (!this.periodoId) {
      throw new Error('PeríodoId é obrigatório');
    }
    if (!this.conteudo.modalidadeReuniao) {
      throw new Error('Modalidade da reunião é obrigatória');
    }
    if (!this.conteudo.maiorDificuldadeAluno) {
      throw new Error('Maior dificuldade do aluno é obrigatória');
    }
    if (this.conteudo.quantidadeReunioes < 0) {
      throw new Error('Quantidade de reuniões deve ser um número positivo');
    }
    if (!this.conteudo.descricaoDificuldade) {
      throw new Error('Descrição da dificuldade é obrigatória');
    }
  }

  public static create(
    tutorId: string,
    bolsistaId: string,
    periodoId: string,
    conteudo: FormAcompanhamentoConteudo,
    observacoes?: string
  ): FormAcompanhamento {
    const id = crypto.randomUUID();
    const dataEnvio = new Date();

    return new FormAcompanhamento(
      id,
      tutorId,
      bolsistaId,
      periodoId,
      conteudo,
      dataEnvio,
      observacoes
    );
  }
}
