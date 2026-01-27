import { IAlocarTutorAlunoRepository } from '../../src/domain/alocarTutorAluno/repositories/IAlocarTutorAlunoRepository';

export class InMemoryAlocarTutorAlunoRepository implements IAlocarTutorAlunoRepository {
    public items: any[] = [];

    async create(data: any): Promise<any> {
        const alocacao = {
            id: Math.random().toString(36).substring(7),
            ...data,
            dataVinculo: new Date(),
            ativo: true
        };
        this.items.push(alocacao);
        return alocacao;
    }

    async findByTutorId(tutorId: string): Promise<any[]> {
        return this.items.filter(i => i.tutorId === tutorId && i.ativo !== false);
    }

    async findByBolsistaId(bolsistaId: string): Promise<any[]> {
        return this.items.filter(i => i.bolsistaId === bolsistaId && i.ativo !== false);
    }

    async getById(id: string): Promise<any | null> {
        return this.items.find(i => i.id === id) || null;
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
            this.items[index].ativo = false; 
        }
    }
    
    async list(): Promise<any[]> {
        return this.items;
    }
}