import { ICursoRepository } from '../../src/domain/curso/repositories/ICursoRepository';
import { Curso } from '../../src/domain/curso/entities/Curso';

export class InMemoryCursoRepository implements ICursoRepository {
    public items: any[] = []; 

    async create(data: any): Promise<Curso> {
        const curso = {
            id: Math.random().toString(36).substring(7),
            nome: data.nome,
            codigo: data.codigo,
            descricao: data.descricao || '',
            ativo: data.ativo ?? true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        this.items.push(curso);
        return curso as unknown as Curso;
    }

    async save(curso: Curso): Promise<void> {
        this.items.push(curso);
    }

    async findById(id: string): Promise<Curso | null> {
        const found = this.items.find(c => c.id === id);
        return found ? (found as unknown as Curso) : null;
    }

    async findByCodigo(codigo: string): Promise<Curso | null> {
        const found = this.items.find(c => c.codigo === codigo);
        return found ? (found as unknown as Curso) : null;
    }

    async findByNome(nome: string): Promise<Curso[]> {
        return this.items.filter(c => c.nome === nome) as unknown as Curso[];
    }

    async findAll(): Promise<Curso[]> {
        return this.items as unknown as Curso[];
    }

    async list(): Promise<Curso[]> {
        return this.findAll();
    }

    async findAtivos(): Promise<Curso[]> {
        return this.items.filter(c => c.ativo === true) as unknown as Curso[];
    }

    async update(curso: Curso): Promise<void> {
        const index = this.items.findIndex(c => c.id === curso.id);
        if (index !== -1) {
            this.items[index] = curso;
        }
    }

    async delete(id: string): Promise<void> {
        const index = this.items.findIndex(c => c.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
}