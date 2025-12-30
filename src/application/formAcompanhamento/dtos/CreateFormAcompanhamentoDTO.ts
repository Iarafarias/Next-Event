export interface CreateFormAcompanhamentoDTO {
  tutorId: string;
  bolsistaId: string;
  periodoId: string;
  conteudo: any; // JSON
  dataEnvio?: Date;
  observacoes?: string;
}
