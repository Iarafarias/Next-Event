export interface CreateRelatorioTutorDTO {
  relatorioId: string;
  tutorId: string;
  periodo: string;
  atividades?: any; // JSON
  alunosAtendidos?: number;
}
