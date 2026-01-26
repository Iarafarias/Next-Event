import { IAlunoRepository } from '../../src/domain/aluno/repositories/IAlunoRepository';
import { Aluno } from '../../src/domain/aluno/entities/Aluno';

export class InMemoryAlunoRepository implements IAlunoRepository {
    public items: any[] = [];

    async save(aluno: Aluno): Promise<void> {
        this.items.push(aluno);
    }

    async findById(id: string): Promise<Aluno | null> {
        return this.items.find(a => a.id === id) || null;
    }

    async findByUsuarioId(usuarioId: string): Promise<Aluno | null> {
        return this.items.find(a => a.usuarioId === usuarioId) || null;
    }

    async findByMatricula(matricula: string): Promise<Aluno | null> {
        return this.items.find(a => a.matricula === matricula) || null;
    }

    async list(): Promise<Aluno[]> {
        return this.items;
    }

    async update(aluno: Aluno): Promise<void> {
        const index = this.items.findIndex(a => a.id === aluno.id);
        if (index !== -1) this.items[index] = aluno;
    }

    async delete(id: string): Promise<void> {
        this.items = this.items.filter(a => a.id !== id);
    }

    // --- Métodos Adicionais Exigidos pela Interface ---

    async findAll(): Promise<Aluno[]> {
        return this.items;
    }

    async findByCursoId(cursoId: string): Promise<Aluno[]> {
        return this.items.filter(a => a.cursoId === cursoId);
    }

    async findByTipoAcesso(tipoAcesso: string): Promise<Aluno[]> {
        return this.items.filter(a => a.tipoAcesso === tipoAcesso);
    }

    async findAlunosComAcessoTutor(): Promise<Aluno[]> {
        // Verifica variações comuns de string ou enum
        return this.items.filter(a => 
            a.tipoAcesso === 'ACESSO_TUTOR' || 
            a.tipoAcesso === 'TUTOR'
        );
    }

    async findAlunosComAcessoBolsista(): Promise<Aluno[]> {
        return this.items.filter(a => 
            a.tipoAcesso === 'ACESSO_BOLSISTA' || 
            a.tipoAcesso === 'BOLSISTA'
        );
    }
}