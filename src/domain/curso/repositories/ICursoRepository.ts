import { Curso } from '../entities/Curso';

export interface ICursoRepository {
  save(curso: Curso): Promise<void>;
  findById(id: string): Promise<Curso | null>;
  findByCodigo(codigo: string): Promise<Curso | null>;
  findByNome(nome: string): Promise<Curso[]>;
  findAll(): Promise<Curso[]>;
  findAtivos(): Promise<Curso[]>;
  update(curso: Curso): Promise<void>;
  delete(id: string): Promise<void>;
}