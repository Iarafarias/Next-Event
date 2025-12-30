export interface RelatorioTutorResponseDTO {
  id: string;
  relatorioId: string;
  tutorId: string;
  periodo: string;
  atividades?: any;
  alunosAtendidos?: number;
}
