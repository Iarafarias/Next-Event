import { CategoriaWorkload } from '@prisma/client';

export interface CreateCargaHorariaMinimaDTO {
  periodoId: string;
  categoria: CategoriaWorkload;
  horasMinimas: number;
  descricao?: string;
}
