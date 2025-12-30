import { TipoRelatorio } from '.prisma/client';
export interface UpdateRelatorioDTO {
  id: string;
  titulo?: string;
  descricao?: string;
  tipo?: TipoRelatorio;
  periodoId?: string;
  arquivoUrl?: string;
}
