import { randomUUID } from 'crypto';

export type UserRole = 'admin' | 'student' | 'tutor' | 'scholarship_holder' | 'coordinator';

export class User {
  id!: string;
  name!: string;
  email!: string;
  password!: string;
  role!: UserRole;
  matricula?: string;
  cpf?: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(props: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    Object.assign(this, {
      ...props,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
