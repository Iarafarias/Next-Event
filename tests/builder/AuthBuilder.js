"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthBuilder = void 0;
const faker_1 = require("@faker-js/faker");
class AuthBuilder {
    props = {
        email: faker_1.faker.internet.email(),
        senha: faker_1.faker.internet.password(),
    };
    static umaTentativa() {
        return new AuthBuilder();
    }
    comEmail(email) {
        this.props.email = email;
        return this;
    }
    comSenha(senha) {
        this.props.senha = senha;
        return this;
    }
    buildDTO() {
        return { ...this.props };
    }
}
exports.AuthBuilder = AuthBuilder;
