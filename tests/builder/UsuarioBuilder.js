"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioBuilder = void 0;
const faker_1 = require("@faker-js/faker");
const Usuario_1 = require("../../src/domain/user/entities/Usuario");
const crypto_1 = require("crypto");
class UsuarioBuilder {
    props = {
        nome: faker_1.faker.person.fullName(),
        email: faker_1.faker.internet.email(),
        senha: faker_1.faker.internet.password(),
        status: 'ATIVO',
        coordenador: undefined,
        tutor: undefined,
        bolsista: undefined,
    };
    static umUsuario() {
        return new UsuarioBuilder();
    }
    comoCoordenador() {
        this.props.coordenador = {
            id: (0, crypto_1.randomUUID)(),
            usuarioId: '', // será definido quando o usuário for criado
            area: faker_1.faker.commerce.department(),
            nivel: 'Sênior'
        };
        return this;
    }
    comoTutor() {
        this.props.tutor = {
            id: (0, crypto_1.randomUUID)(),
            usuarioId: '', // será definido quando o usuário for criado
            area: faker_1.faker.person.jobArea(),
            nivel: 'Doutorado',
            capacidadeMaxima: 10
        };
        return this;
    }
    comoBolsista() {
        this.props.bolsista = {
            id: (0, crypto_1.randomUUID)(),
            usuarioId: '', // será definido quando o usuário for criado
            curso: faker_1.faker.commerce.productName(),
            anoIngresso: 2024
        };
        return this;
    }
    comoAluno() {
        this.props.coordenador = undefined;
        this.props.tutor = undefined;
        this.props.bolsista = undefined;
        return this;
    }
    build() {
        const usuario = new Usuario_1.Usuario({
            nome: this.props.nome,
            email: this.props.email,
            senha: this.props.senha,
            status: this.props.status,
            coordenador: this.props.coordenador,
            tutor: this.props.tutor,
            bolsista: this.props.bolsista,
        });
        if (usuario.coordenador) {
            usuario.coordenador.usuarioId = usuario.id;
        }
        if (usuario.tutor) {
            usuario.tutor.usuarioId = usuario.id;
        }
        if (usuario.bolsista) {
            usuario.bolsista.usuarioId = usuario.id;
        }
        return usuario;
    }
    buildDTO() {
        return { ...this.props };
    }
    semNome() { this.props.nome = ''; return this; }
    semEmail() { this.props.email = ''; return this; }
    semSenha() { this.props.senha = ''; return this; }
    comEmail(email) {
        this.props.email = email;
        return this;
    }
}
exports.UsuarioBuilder = UsuarioBuilder;
