import { CategoriaWorkload } from '@prisma/client';

export interface UpdateCargaHorariaMinimaDTO {
  categoria?: CategoriaWorkload;
  horasMinimas?: number;
  descricao?: string;
}
