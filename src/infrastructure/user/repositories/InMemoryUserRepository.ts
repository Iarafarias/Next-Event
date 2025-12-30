import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { User, UserRole } from '../../../domain/user/entities/User';

export class InMemoryUserRepository implements IUserRepository {
    async listByRole(role: string): Promise<User[]> {
      const roleMap: Record<string, string> = {
        'coordenador': 'coordinator',
        'tutor': 'tutor',
        'bolsista': 'scholar',
      };
      const mappedRole = roleMap[role] || role;
      return this.users.filter(u => u.role === mappedRole);
    }

    async atribuirPapel(userId: string, dto: { papel: "tutor" | "coordenador" | "bolsista"; acao: "atribuir" | "remover"; }): Promise<void> {
      const user = this.users.find(u => u.id === userId);
      if (user) {
        const papelMap: Record<string, string> = {
          'coordenador': 'coordinator',
          'tutor': 'tutor',
          'bolsista': 'scholar',
        };
        if (dto.acao === "atribuir") {
          user.role = (papelMap[dto.papel] || dto.papel) as UserRole;
        } else if (dto.acao === "remover") {
          user.role = null as any;
        }
      }
    }
  private users: User[] = [];

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async update(data: { id: string; name?: string; email?: string; password?: string; matricula?: string; cpf?: string; }): Promise<User| null> {
    const user = this.users.find(u => u.id === data.id);
    if (!user) return null;
    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.password) user.password = data.password;
    if (data.matricula) user.matricula = data.matricula;
    if (data.cpf) user.cpf = data.cpf;
    
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }
}
