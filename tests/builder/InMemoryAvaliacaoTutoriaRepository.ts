import { IAvaliacaoTutoriaRepository } from '../../src/domain/avaliacaoTutoria/repositories/IAvaliacaoTutoriaRepository';
import { AvaliacaoTutoria } from '../../src/domain/avaliacaoTutoria/entities/AvaliacaoTutoria';

export class InMemoryAvaliacaoTutoriaRepository implements IAvaliacaoTutoriaRepository {
  public items: AvaliacaoTutoria[] = [];

  async save(avaliacao: AvaliacaoTutoria): Promise<void> {
    const index = this.items.findIndex((item) => item.id === avaliacao.id);
    if (index !== -1) {
      this.items[index] = avaliacao;
    } else {
      this.items.push(avaliacao);
    }
  }

  async update(avaliacao: AvaliacaoTutoria): Promise<void> {
    const index = this.items.findIndex((item) => item.id === avaliacao.id);
    if (index !== -1) {
      this.items[index] = avaliacao;
    }
  }

  async findAll(): Promise<AvaliacaoTutoria[]> {
    return this.items;
  }

  async findById(id: string): Promise<AvaliacaoTutoria | null> {
    const avaliacao = this.items.find((item) => item.id === id);
    return avaliacao || null;
  }

  async findByUsuarioId(usuarioId: string): Promise<AvaliacaoTutoria[]> {
    return this.items.filter((item) => item.usuarioId === usuarioId);
  }

  async findByPeriodoId(periodoId: string): Promise<AvaliacaoTutoria[]> {
    return this.items.filter((item) => item.periodoId === periodoId);
  }

  async findByTipoAvaliador(tipo: string): Promise<AvaliacaoTutoria[]> {
    return this.items.filter((item) => item.tipoAvaliador === tipo);
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}