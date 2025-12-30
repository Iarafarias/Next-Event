export interface CreateAlocarTutorAlunoDTO {
  tutorId: string;
  bolsistaId: string;
  periodoId: string;
  dataInicio: Date;
  dataFim?: Date;
  ativo?: boolean;
}
