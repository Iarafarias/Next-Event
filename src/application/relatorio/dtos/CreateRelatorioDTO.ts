import { TipoRelatorio } from '.prisma/client';
export interface CreateRelatorioDTO {
  titulo: string;
  descricao?: string;
  tipo: TipoRelatorio;
  geradorId: string; // Usuario.id
  periodoId?: string;
  arquivoUrl?: string;
}
