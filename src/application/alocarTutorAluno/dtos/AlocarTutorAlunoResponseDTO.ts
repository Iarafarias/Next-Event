export interface AlocarTutorAlunoResponseDTO {
  id: string;
  tutorId: string;
  bolsistaId: string;
  periodoId: string;
  dataInicio: Date;
  dataFim?: Date;
  ativo: boolean;
}
