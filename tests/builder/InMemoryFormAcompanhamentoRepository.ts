import { IFormAcompanhamentoRepository } from '../../src/domain/formAcompanhamento/repositories/IFormAcompanhamentoRepository';

export class InMemoryFormAcompanhamentoRepository implements IFormAcompanhamentoRepository {
    public items: any[] = [];

    async create(data: any): Promise<any> {
        const form = {
            id: Math.random().toString(36).substring(7),
            ...data,
            createdAt: new Date()
        };
        this.items.push(form);
        return form;
    }

    async getById(id: string): Promise<any | null> {
        return this.items.find(f => f.id === id) || null;
    }

    async listByBolsista(bolsistaId: string): Promise<any[]> {
        return this.items.filter(f => f.bolsistaId === bolsistaId);
    }

    async list(): Promise<any[]> {
        return this.items;
    }

    async update(id: string, data: any): Promise<any> {
        const index = this.items.findIndex(f => f.id === id);
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...data };
            return this.items[index];
        }
        return null;
    }

    async delete(id: string): Promise<void> {
        const index = this.items.findIndex(f => f.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
}