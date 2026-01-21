export interface FormAcompanhamentoResponseDTO {
  id: string;
  tutorId: string;
  bolsistaId: string;
  periodoId: string;
  conteudo: {
    modalidadeReuniao: 'VIRTUAL' | 'PRESENCIAL';
    maiorDificuldadeAluno: string;
    quantidadeReunioes: number;
    descricaoDificuldade: string;
    nomeAluno: string;
    nomeTutor: string;
    dataPreenchimento: Date;
  };
  dataEnvio: Date;
  observacoes?: string;
  tutor?: {
    id: string;
    usuario: {
      nome: string;
      email: string;
    };
  };
  bolsista?: {
    id: string;
    usuario: {
      nome: string;
      email: string;
    };
  };
  periodo?: {
    id: string;
    nome: string;
    dataInicio: Date;
    dataFim: Date;
  };
}
