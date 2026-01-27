import { IPeriodoTutoriaRepository } from '../../src/domain/periodoTutoria/repositories/IPeriodoTutoriaRepository';

export class InMemoryPeriodoTutoriaRepository implements IPeriodoTutoriaRepository {
    public items: any[] = [];

    async create(data: any): Promise<any> {
        const periodo = {
            id: Math.random().toString(36).substring(7),
            ...data,
            ativo: data.ativo ?? true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.items.push(periodo);
        return periodo;
    }

    async getById(id: string): Promise<any | null> {
        return this.items.find(p => p.id === id) || null;
    }

    async list(): Promise<any[]> {
        return this.items.filter(p => p.ativo !== false);
    }

    async update(id: string, data: any): Promise<any> {
        const index = this.items.findIndex(p => p.id === id);
        if (index !== -1) {
            this.items[index] = { ...this.items[index], ...data };
            return this.items[index];
        }
        return null;
    }

    async delete(id: string): Promise<void> {
        const index = this.items.findIndex(p => p.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
    
    async findOverlapping(inicio: Date, fim: Date): Promise<any[]> {
        return [];
    }
}