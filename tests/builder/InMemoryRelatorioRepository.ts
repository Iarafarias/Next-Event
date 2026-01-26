import { IRelatorioRepository } from '../../src/domain/relatorio/repositories/IRelatorioRepository';
import { CreateRelatorioDTO } from '../../src/application/relatorio/dtos/CreateRelatorioDTO';
import { UpdateRelatorioDTO } from '../../src/application/relatorio/dtos/UpdateRelatorioDTO';
import { RelatorioResponseDTO } from '../../src/application/relatorio/dtos/RelatorioResponseDTO';

export class InMemoryRelatorioRepository implements IRelatorioRepository {
    public relatorios: any[] = []; 

    async create(data: CreateRelatorioDTO): Promise<RelatorioResponseDTO> {
        const novo = {
            id: Math.random().toString(36).substring(7),
            ...data,
            dataEnvio: new Date(),
            status: 'PENDENTE',
            criadoEm: new Date(),
            atualizadoEm: new Date()
        };
        this.relatorios.push(novo);
        return novo as unknown as RelatorioResponseDTO;
    }

    async update(data: UpdateRelatorioDTO): Promise<RelatorioResponseDTO> {
        const id = (data as any).id; 
        
        if (!id) throw new Error('ID não fornecido para atualização');

        const index = this.relatorios.findIndex(r => r.id === id);
        if (index === -1) throw new Error('Relatório não encontrado');
        
        const atualizado = { ...this.relatorios[index], ...data };
        this.relatorios[index] = atualizado;
        return atualizado as unknown as RelatorioResponseDTO;
    }

    async delete(id: string): Promise<void> {
        this.relatorios = this.relatorios.filter(r => r.id !== id);
    }

    async findById(id: string): Promise<RelatorioResponseDTO | null> {
        const found = this.relatorios.find(r => r.id === id);
        return found ? (found as unknown as RelatorioResponseDTO) : null;
    }

    async findAll(): Promise<RelatorioResponseDTO[]> {
        return this.relatorios as unknown as RelatorioResponseDTO[];
    }

    async list(): Promise<RelatorioResponseDTO[]> {
        return this.findAll();
    }

    async listByBolsista(bolsistaId: string): Promise<RelatorioResponseDTO[]> {
        return this.relatorios.filter(r => r.bolsistaId === bolsistaId) as unknown as RelatorioResponseDTO[];
    }

    async listByTutor(tutorId: string): Promise<RelatorioResponseDTO[]> {
        return this.relatorios as unknown as RelatorioResponseDTO[]; 
    }

    async listByCoordenador(coordenadorId: string): Promise<RelatorioResponseDTO[]> {
        return this.relatorios as unknown as RelatorioResponseDTO[];
    }
}