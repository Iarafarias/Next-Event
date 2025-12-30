export interface CreateRelatorioAvaliacaoDTO {
  relatorioId: string;
  bolsistaId: string;
  nota?: number;
  comentarios?: string;
  periodo: string;
}
