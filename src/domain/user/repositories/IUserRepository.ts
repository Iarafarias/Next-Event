import { User } from '../entities/User';
import { UpdateUsuarioDTO } from '../../../application/user/dtos/UpdateUserDTO';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(data: UpdateUsuarioDTO): Promise<User | null>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;

  listByRole(role: 'coordenador' | 'tutor' | 'bolsista'): Promise<User[]>;

  atribuirPapel(userId: string, dto: { papel: 'coordenador' | 'tutor' | 'bolsista'; acao: 'atribuir' | 'remover' }): Promise<void>;
}
