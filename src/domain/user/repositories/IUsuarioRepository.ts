import { Usuario } from '../entities/Usuario';

export interface IUsuarioRepository {
  findByEmail(email: string): Promise<Usuario | null>;
  findById(id: string): Promise<Usuario | null>;
  create(usuario: Usuario): Promise<Usuario>;
  update(usuario: Partial<Usuario>): Promise<Usuario | null>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Usuario[]>;
  listByRole(role: string): Promise<Usuario[]>;
}
