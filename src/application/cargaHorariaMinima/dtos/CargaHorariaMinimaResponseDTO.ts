import { CategoriaWorkload } from '@prisma/client';

export interface CargaHorariaMinimaResponseDTO {
  id: string;
  periodoId: string;
  categoria: CategoriaWorkload;
  horasMinimas: number;
  descricao?: string;
}
