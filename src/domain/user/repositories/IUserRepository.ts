import { User } from '../entities/User';
import { UpdateUserDTO } from '../../../application/user/dtos/UpdateUserDTO';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(data: UpdateUserDTO): Promise<User | null>;
  delete(id: string): Promise<void>;
  findAll(): Promise<User[]>;
}
