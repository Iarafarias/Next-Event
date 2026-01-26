import { ICargaHorariaMinimaRepository } from '../../src/domain/cargaHorariaMinima/repositories/ICargaHorariaMinimaRepository';

export class InMemoryCargaHorariaMinimaRepository implements ICargaHorariaMinimaRepository {
    public items: any[] = [];

    async create(data: any): Promise<any> {
        const item = {
            id: Math.random().toString(36).substring(7),
            ...data
        };
        this.items.push(item);
        return item;
    }

    async getById(id: string): Promise<any | null> {
        return this.items.find(i => i.id === id) || null;
    }

    async listByPeriodo(periodoId: string): Promise<any[]> {
        return this.items.filter(i => i.periodoId === periodoId);
    }

    async list(): Promise<any[]> {
        return this.items;
    }

    async update(id: string, data: any): Promise<any> {
        const index = this.items.findIndex(i => i.id === id);
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...data };
            return this.items[index];
        }
        return null;
    }

    async delete(id: string): Promise<void> {
        const index = this.items.findIndex(i => i.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
}