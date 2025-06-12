import { User } from '../entities/User';
import { UpdateUserDTO } from '../../../application/user/dtos/UpdateUserDTO';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User| null>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  update(data: UpdateUserDTO): Promise<User| null>;
  delete(id: string): Promise<void>;
}
