export type NivelSatisfacao = 'MUITO_INSATISFEITO' | 'INSATISFEITO' | 'NEUTRO' | 'SATISFEITO' | 'MUITO_SATISFEITO';
export type StatusAvaliacao = 'RASCUNHO' | 'ENVIADA' | 'ANALISADA';

export interface ExperienciaTutoria {
  aspectosPositivos: string[];
  aspectosNegativos: string[];
  sugestoesMelhorias: string[];
  comentarioGeral: string;
}

export interface DificuldadesTutoria {
  dificuldadesComunicacao: string;
  dificuldadesConteudo: string;
  dificuldadesMetodologicas: string;
  dificuldadesRecursos: string;
  outrasDificuldades?: string;
}

export interface AvaliacaoConteudo {
  experiencia: ExperienciaTutoria;
  dificuldades: DificuldadesTutoria;
  nivelSatisfacaoGeral: NivelSatisfacao;
  recomendariaPrograma: boolean;
  justificativaRecomendacao: string;
  dataPreenchimento: Date;
  nomeAvaliador: string;
  periodoAvaliado: string;
}

export class AvaliacaoTutoria {
  public readonly id: string;
  public readonly usuarioId: string;
  public readonly periodoId: string;
  public readonly tipoAvaliador: 'TUTOR' | 'ALUNO';
  public readonly conteudo: AvaliacaoConteudo;
  public readonly status: StatusAvaliacao;
  public readonly dataEnvio: Date;
  public readonly dataAtualizacao: Date;

  constructor(
    id: string,
    usuarioId: string,
    periodoId: string,
    tipoAvaliador: 'TUTOR' | 'ALUNO',
    conteudo: AvaliacaoConteudo,
    status: StatusAvaliacao = 'RASCUNHO',
    dataEnvio: Date,
    dataAtualizacao: Date
  ) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.periodoId = periodoId;
    this.tipoAvaliador = tipoAvaliador;
    this.conteudo = conteudo;
    this.status = status;
    this.dataEnvio = dataEnvio;
    this.dataAtualizacao = dataAtualizacao;
    
    this.validate();
  }

  private validate(): void {
    if (!this.usuarioId) {
      throw new Error('Usuário é obrigatório');
    }
    if (!this.periodoId) {
      throw new Error('Período é obrigatório');
    }
    if (!this.tipoAvaliador) {
      throw new Error('Tipo do avaliador é obrigatório');
    }
    if (!this.conteudo.experiencia.comentarioGeral) {
      throw new Error('Comentário geral da experiência é obrigatório');
    }
    if (!this.conteudo.justificativaRecomendacao) {
      throw new Error('Justificativa da recomendação é obrigatória');
    }
  }

  public static create(
    usuarioId: string,
    periodoId: string,
    tipoAvaliador: 'TUTOR' | 'ALUNO',
    conteudo: AvaliacaoConteudo
  ): AvaliacaoTutoria {
    const id = crypto.randomUUID();
    const agora = new Date();
    
    return new AvaliacaoTutoria(
      id,
      usuarioId,
      periodoId,
      tipoAvaliador,
      conteudo,
      'RASCUNHO',
      agora,
      agora
    );
  }

  public enviar(): AvaliacaoTutoria {
    return new AvaliacaoTutoria(
      this.id,
      this.usuarioId,
      this.periodoId,
      this.tipoAvaliador,
      this.conteudo,
      'ENVIADA',
      this.dataEnvio,
      new Date()
    );
  }

  public marcarComoAnalisada(): AvaliacaoTutoria {
    return new AvaliacaoTutoria(
      this.id,
      this.usuarioId,
      this.periodoId,
      this.tipoAvaliador,
      this.conteudo,
      'ANALISADA',
      this.dataEnvio,
      new Date()
    );
  }

  public podeEditar(): boolean {
    return this.status === 'RASCUNHO';
  }
}
