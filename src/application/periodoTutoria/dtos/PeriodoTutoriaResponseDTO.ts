export interface PeriodoTutoriaResponseDTO {
  id: string;
  nome: string;
  dataInicio: Date;
  dataFim: Date;
  ativo: boolean;
  descricao?: string;
}
