import { Pool } from 'pg';
import { IUserRepository } from '../../../domain/user/repositories/IUserRepository';
import { User } from '../../../domain/user/entities/User';
import { UpdateUserDTO } from '../../../application/user/dtos/UpdateUserDTO';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5433/evento_system_db',
});

export class PostgresUserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.query(
        `INSERT INTO cadastro_usuarios (nome, cpf, email, senha, tipo_usuario, matricula)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user.name, user.cpf, user.email, hashedPassword, 'usuario_participante', user.matricula]
      );
    } catch (err: any) {
      if (err.code === '23505') {
        if (err.detail.includes('cpf')) throw new Error('CPF já cadastrado.');
        if (err.detail.includes('email')) throw new Error('E-mail já cadastrado.');
        if (err.detail.includes('matricula')) throw new Error('Matrícula já cadastrada.');
      }
      throw err;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM cadastro_usuarios WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) return null;
    return this.mapRowToUser(result.rows[0]);
  }

  async findAll(): Promise<User[]> {
    const result = await pool.query('SELECT * FROM cadastro_usuarios');
    return result.rows.map(this.mapRowToUser);
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM cadastro_usuarios WHERE id_usuario = $1',
      [Number(id)]
    );
    if (result.rows.length === 0) return null;
    return this.mapRowToUser(result.rows[0]);
  }

  async update(data: UpdateUserDTO): Promise<User | null> {
    let hashedPassword = undefined;
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }
    const result = await pool.query(
      `UPDATE cadastro_usuarios SET nome = $1, email = $2, senha = $3
       WHERE id_usuario = $4 RETURNING *`,
      [data.name, data.email, hashedPassword, Number(data.id)]
    );
    if (result.rows.length === 0) return null;
    return this.mapRowToUser(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM cadastro_usuarios WHERE id_usuario = $1', [Number(id)]);
  }

  private mapRowToUser(row: any): User {
    return new User({
      name: row.nome,
      email: row.email,
      password: row.senha,
      matricula: row.matricula,
      cpf: row.cpf,
    }, row.id_usuario.toString());
  }
}
