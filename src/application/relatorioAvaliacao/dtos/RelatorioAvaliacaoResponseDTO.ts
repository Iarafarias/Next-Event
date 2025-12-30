export interface RelatorioAvaliacaoResponseDTO {
  id: string;
  relatorioId: string;
  bolsistaId: string;
  nota?: number;
  comentarios?: string;
  periodo: string;
}
