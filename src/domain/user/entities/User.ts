export type UserRole = 'admin' | 'user';

export class User {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  matricula!: string;
  cpf!: string;
  role!: UserRole;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(props: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    Object.assign(this, {
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
