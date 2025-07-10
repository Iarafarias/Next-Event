import { UserRole } from '../../../domain/user/entities/User';

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  matricula: string;
  cpf: string;
  role?: UserRole;
}
