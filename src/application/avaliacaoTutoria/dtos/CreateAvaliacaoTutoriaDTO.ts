export interface CreateAvaliacaoTutoriaDTO {
  usuarioId: string;
  periodoId: string;
  tipoAvaliador: 'TUTOR' | 'ALUNO';

  // Experiência
  aspectosPositivos: string[];
  aspectosNegativos: string[];
  sugestoesMelhorias: string[];
  comentarioGeral: string;

  // Dificuldades
  dificuldadesComunicacao: string;
  dificuldadesConteudo: string;
  dificuldadesMetodologicas: string;
  dificuldadesRecursos: string;
  outrasDificuldades?: string;

  // Avaliação geral
  nivelSatisfacaoGeral: 'MUITO_INSATISFEITO' | 'INSATISFEITO' | 'NEUTRO' | 'SATISFEITO' | 'MUITO_SATISFEITO';
  recomendariaPrograma: boolean;
  justificativaRecomendacao: string;
  periodoAvaliado?: string;
}


export interface UpdateAvaliacaoTutoriaDTO {
  aspectosPositivos?: string[];
  aspectosNegativos?: string[];
  sugestoesMelhorias?: string[];
  comentarioGeral?: string;
  dificuldadesComunicacao?: string;
  dificuldadesConteudo?: string;
  dificuldadesMetodologicas?: string;
  dificuldadesRecursos?: string;
  outrasDificuldades?: string;
  nivelSatisfacaoGeral?: 'MUITO_INSATISFEITO' | 'INSATISFEITO' | 'NEUTRO' | 'SATISFEITO' | 'MUITO_SATISFEITO';
  recomendariaPrograma?: boolean;
  justificativaRecomendacao?: string;
}
