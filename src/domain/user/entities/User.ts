export type UserRole = 'admin' | 'participant';

export class User {
  public readonly id: string;
  public name: string;
  public email: string;
  public password: string;
  public matricula: string;
  public cpf: string;
  public role: UserRole;

  constructor(props: Omit<User, 'id'>, id?: string) {
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.matricula = props.matricula;
    this.cpf = props.cpf;
    this.role = props.role;
    this.id = id ?? crypto.randomUUID();
  }
}
