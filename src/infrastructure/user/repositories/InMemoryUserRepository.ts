import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { User} from '../../../domain/user/entities/User';

export class InMemoryUserRepository implements IUserRepository {
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
    
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }
}
