import { faker } from '@faker-js/faker';
import { Usuario } from '../../src/domain/user/entities/Usuario';
import { CreateUsuarioDTO } from '../../src/application/user/dtos/CreateUserDTO';

export class UsuarioBuilder {
  private props = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    senha: faker.internet.password(),
    status: 'ATIVO' as const,
    coordenador: undefined as any,
    tutor: undefined as any,
    bolsista: undefined as any,
  };

  public static umUsuario(): UsuarioBuilder {
    return new UsuarioBuilder();
  }

  public comoCoordenador(): this {
    this.props.coordenador = { area: faker.commerce.department(), nivel: 'Sênior' };
    return this;
  }

  public comoTutor(): this {
    this.props.tutor = { area: faker.person.jobArea(), nivel: 'Doutorado', capacidadeMaxima: 10 };
    return this;
  }

  public comoBolsista(): this {
    this.props.bolsista = { curso: faker.commerce.productName(), anoIngresso: 2024 };
    return this;
  }

  public comoAluno(): this {
    this.props.coordenador = undefined;
    this.props.tutor = undefined;
    this.props.bolsista = undefined;
    return this;
  }

  public build(): Usuario {
    const usuario = new Usuario({
      nome: this.props.nome,
      email: this.props.email,
      senha: this.props.senha,
      status: this.props.status,
      coordenador: this.props.coordenador,
      tutor: this.props.tutor,
      bolsista: this.props.bolsista,
    });
    usuario.id = crypto.randomUUID();
    return usuario;
  }

  public buildDTO(): CreateUsuarioDTO {
    return { ...this.props };
  }

  public semNome(): this { this.props.nome = ''; return this; }
  public semEmail(): this { this.props.email = ''; return this; }
  public semSenha(): this { this.props.senha = ''; return this; }

  public comEmail(email: string): this {
    this.props.email = email;
    return this;
  }
}