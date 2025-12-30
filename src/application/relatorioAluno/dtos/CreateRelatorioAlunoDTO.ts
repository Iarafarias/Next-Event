export interface CreateRelatorioAlunoDTO {
  relatorioId: string;
  bolsistaId: string;
  periodo: string;
  atividades?: any; // JSON
  observacoes?: string;
}
