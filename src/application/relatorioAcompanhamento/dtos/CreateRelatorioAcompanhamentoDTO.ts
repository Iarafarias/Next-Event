export interface CreateRelatorioAcompanhamentoDTO {
  relatorioId: string;
  tutorId: string;
  periodo: string;
  atividades?: any; // JSON
  resultados?: string;
}
