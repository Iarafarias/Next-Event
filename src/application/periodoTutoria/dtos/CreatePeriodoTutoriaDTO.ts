export interface CreatePeriodoTutoriaDTO {
  nome: string;
  dataInicio: Date;
  dataFim: Date;
  ativo?: boolean;
  descricao?: string;
}
