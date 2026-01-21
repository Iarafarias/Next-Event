import { Usuario } from '../../src/domain/user/entities/Usuario';
import { CreateUsuarioDTO } from '../../src/application/user/dtos/CreateUserDTO';
export declare class UsuarioBuilder {
    private props;
    static umUsuario(): UsuarioBuilder;
    comoCoordenador(): this;
    comoTutor(): this;
    comoBolsista(): this;
    comoAluno(): this;
    build(): Usuario;
    buildDTO(): CreateUsuarioDTO;
    semNome(): this;
    semEmail(): this;
    semSenha(): this;
    comEmail(email: string): this;
}
