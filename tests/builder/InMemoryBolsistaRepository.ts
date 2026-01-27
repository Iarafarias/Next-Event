export class InMemoryBolsistaRepository {
    public items: any[] = [];

    async findByUserId(usuarioId: string): Promise<any> {
        return this.items.find(b => b.usuarioId === usuarioId) || null;
    }

    async findById(id: string): Promise<any> {
        return this.items.find(b => b.id === id) || null;
    }

    async create(data: any): Promise<any> {
        const novo = {
            id: Math.random().toString(36).substring(7),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.items.push(novo);
        return novo;
    }

    async list(): Promise<any[]> {
        return this.items;
    }
    
    // Método para simular contagem de horas ou dados do dashboard
    async getDashboardData(bolsistaId: string): Promise<any> {
        return {
            horasCumpridas: 10,
            horasPendentes: 20,
            atividadesRecentes: []
        };
    }
}