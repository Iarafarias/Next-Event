import { IUsuarioRepository } from './../../src/domain/user/repositories/IUsuarioRepository';
import { Usuario } from '../../src/domain/user/entities/Usuario';
export declare class InMemoryUsuarioRepository implements IUsuarioRepository {
    usuarios: Usuario[];
    save(usuario: Usuario): Promise<void>;
    create(usuario: Usuario): Promise<Usuario>;
    findByEmail(email: string): Promise<Usuario | null>;
    findById(id: string): Promise<Usuario | null>;
    findAll(): Promise<Usuario[]>;
    update(usuario: Partial<Usuario>): Promise<Usuario | null>;
    delete(id: string): Promise<void>;
    listByRole(role: string): Promise<Usuario[]>;
    atribuirPapel(userId: string, dto: {
        papel: string;
        acao: 'atribuir' | 'remover';
        dados?: any;
    }): Promise<void>;
}
