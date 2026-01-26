export interface CreateFormAcompanhamentoDTO {
  tutorId: string;
  bolsistaId: string;
  periodoId: string;
  nomeAluno?: string; // preenchido automaticamente
  nomeTutor?: string; // preenchido automaticamente
  dataPreenchimento?: Date; // preenchido automaticamente
  modalidadeReuniao: 'VIRTUAL' | 'PRESENCIAL';
  maiorDificuldadeAluno: string;
  quantidadeReunioes: number;
  quantidadeVirtuais?: number;
  quantidadePresenciais?: number;
  descricaoDificuldade: string;
  observacoes?: string;
}

export interface FormAcompanhamentoConteudo {
  modalidadeReuniao: 'VIRTUAL' | 'PRESENCIAL';
  maiorDificuldadeAluno: string;
  quantidadeReunioes: number;
  quantidadeVirtuais: number;
  quantidadePresenciais: number;
  descricaoDificuldade: string;
  nomeAluno: string;
  nomeTutor: string;
  dataPreenchimento: Date;
}

