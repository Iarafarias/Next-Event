"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryUsuarioRepository = void 0;
class InMemoryUsuarioRepository {
    usuarios = [];
    async save(usuario) {
        const index = this.usuarios.findIndex(u => u.id === usuario.id);
        if (index !== -1) {
            this.usuarios[index] = usuario;
        }
        else {
            this.usuarios.push(usuario);
        }
    }
    async create(usuario) {
        this.usuarios.push(usuario);
        return usuario;
    }
    async findByEmail(email) {
        return this.usuarios.find(u => u.email === email) || null;
    }
    async findById(id) {
        return this.usuarios.find(u => u.id === id) || null;
    }
    async findAll() {
        return this.usuarios;
    }
    async update(usuario) {
        const index = this.usuarios.findIndex(u => u.id === usuario.id);
        if (index === -1)
            return null;
        this.usuarios[index] = { ...this.usuarios[index], ...usuario };
        return this.usuarios[index];
    }
    async delete(id) {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
    }
    async listByRole(role) {
        return this.usuarios.filter(u => {
            if (role === 'bolsista' || role === 'scholarship_holder')
                return !!u.bolsista;
            if (role === 'tutor')
                return !!u.tutor;
            if (role === 'coordenador' || role === 'coordinator')
                return !!u.coordenador;
            return false;
        }).map(u => {
            // Garantir que as propriedades sejam preservadas corretamente
            return {
                ...u,
                coordenador: u.coordenador || undefined,
                tutor: u.tutor || undefined,
                bolsista: u.bolsista || undefined
            };
        });
    }
    async atribuirPapel(userId, dto) {
        const usuario = this.usuarios.find(u => u.id === userId);
        if (!usuario)
            return;
        if (dto.acao === 'remover') {
            if (dto.papel === 'coordenador')
                usuario.coordenador = undefined;
            if (dto.papel === 'tutor')
                usuario.tutor = undefined;
            if (dto.papel === 'bolsista')
                usuario.bolsista = undefined;
            return;
        }
        const novoId = crypto.randomUUID();
        if (dto.papel === 'coordenador') {
            usuario.coordenador = {
                id: novoId,
                usuarioId: userId,
                area: dto.dados?.area || 'Geral',
                nivel: dto.dados?.nivel || 'Sênior'
            };
        }
        if (dto.papel === 'tutor') {
            usuario.tutor = {
                id: novoId,
                usuarioId: userId,
                area: dto.dados?.area || 'Geral',
                capacidadeMaxima: 5
            };
        }
        if (dto.papel === 'bolsista') {
            usuario.bolsista = {
                id: novoId,
                usuarioId: userId,
                curso: 'Engenharia',
                anoIngresso: 2024
            };
        }
    }
}
exports.InMemoryUsuarioRepository = InMemoryUsuarioRepository;
