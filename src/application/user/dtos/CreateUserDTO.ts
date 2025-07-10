export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  matricula: string;
  cpf: string;
  role: 'admin' | 'participant';
}
