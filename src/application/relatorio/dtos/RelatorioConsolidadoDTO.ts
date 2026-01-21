export interface RelatorioConsolidadoDTO {
  periodo: {
    id: string;
    nome: string;
    dataInicio: Date;
    dataFim: Date;
  };
  estatisticas: {
    totalAlunos: number;
    totalTutores: number;
    totalFormulariosAcompanhamento: number;
    totalAvaliacoesTutoria: number;
    totalCertificadosPendentes: number;
    totalCertificadosAprovados: number;
    totalCertificadosRejeitados: number;
  };
  distribuicaoSatisfacao: {
    muitoInsatisfeito: number;
    insatisfeito: number;
    neutro: number;
    satisfeito: number;
    muitoSatisfeito: number;
  };
  principaisDificuldades: {
    comunicacao: number;
    conteudo: number;
    metodologicas: number;
    recursos: number;
    outras: number;
  };
  alunosPorTutor: {
    tutorNome: string;
    tutorEmail: string;
    quantidadeAlunos: number;
    avaliacaoMedia?: number;
  }[];
  certificadosPorCategoria: {
    categoria: string;
    total: number;
    aprovados: number;
    pendentes: number;
    rejeitados: number;
  }[];
  formsAcompanhamentoPorMes: {
    mes: string;
    quantidade: number;
  }[];
  geradoEm: Date;
  geradoPor: string;
}

export interface GenerateRelatorioConsolidadoRequest {
  periodoId?: string;
  dataInicio?: Date;
  dataFim?: Date;
  incluirDetalhes?: boolean;
}
