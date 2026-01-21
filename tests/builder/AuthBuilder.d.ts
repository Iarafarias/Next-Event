export declare class AuthBuilder {
    private props;
    static umaTentativa(): AuthBuilder;
    comEmail(email: string): this;
    comSenha(senha: string): this;
    buildDTO(): {
        email: string;
        senha: string;
    };
}
