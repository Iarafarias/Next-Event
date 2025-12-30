export interface RelatorioResponseDTO {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: string;
  geradorId: string;
  periodoId?: string;
  arquivoUrl?: string;
  criadoEm: Date;
  atualizadoEm: Date;
}
