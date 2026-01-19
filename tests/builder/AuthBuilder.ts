import { faker } from '@faker-js/faker';

export class AuthBuilder {
  private props = {
    email: faker.internet.email(),
    senha: faker.internet.password(),
  };

  public static umaTentativa(): AuthBuilder {
    return new AuthBuilder();
  }

  public comEmail(email: string): this {
    this.props.email = email;
    return this;
  }

  public comSenha(senha: string): this {
    this.props.senha = senha;
    return this;
  }

  public buildDTO() {
    return { ...this.props };
  }
}