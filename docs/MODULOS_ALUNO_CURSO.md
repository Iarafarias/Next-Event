# Documentação Técnica: Módulos de Aluno e Curso

Esta documentação detalha as mudanças arquiteturais e as novas funcionalidades implementadas para a gestão de alunos e cursos no sistema NextCertify.

---

## 1. Criação Automática de Perfil (Aluno)

Uma das mudanças mais significativas foi a automatização do vínculo entre o Usuário (Login) e seu perfil acadêmico (Aluno).

### Como funciona:
Ao realizar o cadastro via `POST /api/users`, o sistema agora exige (ou aceita) um objeto `aluno`. Mesmo que não enviado, o sistema cria um registro na tabela `Aluno` para garantir a integridade referencial.

**Exemplo de Payload de Cadastro:**
```json
{
  "nome": "Usuário Exemplo",
  "email": "user@exemplo.com",
  "senha": "...",
  "aluno": {
    "cursoId": "uuid-do-curso",
    "matricula": "20260001"
  }
}
```

### Sincronização de Papéis (Roles)
O campo `role` na tabela `Aluno` é sincronizado automaticamente com os perfis de Tutor e Bolsista:
- **ALUNO**: Perfil base (padrão).
- **TUTOR**: Quando o usuário possui um perfil ativo de Tutor.
- **BOLSISTA**: Quando o usuário possui um perfil ativo de Bolsista.
- **TUTOR_BOLSISTA**: Quando o usuário acumula ambas as funções.

---

## 2. Gestão de Cursos (CRUD)

Implementamos um módulo completo para gerenciamento de cursos, seguindo a **Clean Architecture**.

### Endpoints:
- `POST /api/cursos`: Criação de novo curso (Admin/Coordenador).
- `GET /api/cursos`: Listagem pública (necessária para preencher o Select de cadastro).
- `GET /api/cursos/:id`: Detalhes de um curso específico.
- `PUT /api/cursos/:id`: Edição de dados.
- `DELETE /api/cursos/:id`: Remoção (bloqueada se houver alunos vinculados).

---

## 3. Endpoints de Aluno

Novas rotas para consulta e gestão de perfis acadêmicos:
- `GET /api/alunos`: Listagem com suporte a filtros por `cursoId` e `role`.
- `GET /api/alunos/:id`: Busca detalhada por ID.
- `PUT /api/alunos/:id`: Atualização de matrícula e curso.

---

## 4. Mudanças no Banco de Dados (Prisma)

As seguintes tabelas e relacionamentos foram adicionados/modificados:

- **Curso**: Armazena código e nome do curso acadêmico.
- **Aluno**: Tabela pivot que vincula o Usuário ao seu curso e aos seus perfis específicos (Tutor/Bolsista).
- **Relacionamentos**:
  - `Usuario` 1:1 `Aluno`
  - `Curso` 1:N `Aluno`
  - `Aluno` 1:1 `TutorProfile` (opcional)
  - `Aluno` 1:1 `BolsistaProfile` (opcional)

---

## 5. Autenticação e Login (Novidade)

O endpoint de login (`POST /api/users/login`) foi aprimorado para facilitar a vida do frontend. A resposta agora inclui o objeto completo do usuário com seu papel e dados de matrícula:

```json
{
  "token": "...",
  "usuario": {
    "id": "...",
    "nome": "...",
    "role": "student",
    "aluno": {
      "matricula": "20260001",
      "role": "ALUNO"
    }
  }
}
```
