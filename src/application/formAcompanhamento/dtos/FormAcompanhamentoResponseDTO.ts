export interface FormAcompanhamentoResponseDTO {
  id: string;
  tutorId: string;
  bolsistaId: string;
  periodoId: string;
  conteudo: any;
  dataEnvio: Date;
  observacoes?: string;
}
