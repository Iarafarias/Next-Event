export interface RelatorioAlunoResponseDTO {
  id: string;
  relatorioId: string;
  bolsistaId: string;
  periodo: string;
  atividades?: any;
  observacoes?: string;
}
