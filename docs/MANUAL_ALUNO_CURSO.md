# Manual de Uso: Sistema de Aluno e Curso

## Visão Geral

Este manual explica como usar os novos endpoints de **Curso** e **Aluno**, além de demonstrar como funciona a criação automática do registro de aluno ao cadastrar usuários.

### Mudanças Principais

✅ **Todo usuário criado automaticamente tem um perfil de Aluno**  
✅ **Cursos podem ser gerenciados via API REST**  
✅ **Alunos podem ser consultados, filtrados e vinculados a cursos**  

---

## 📚 Gerenciamento de Cursos

### 1. Criar um Curso

**Endpoint**: `POST /api/cursos`  
**Autenticação**: Requer token JWT  
**Permissões**: `coordinator` ou `scholarship_holder`

```bash
curl -X POST http://localhost:3000/api/cursos \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Sistemas de Informação",
    "codigo": "SI-2026",
    "descricao": "Curso de graduação em Sistemas de Informação"
  }'
```

**Resposta** (201 Created):
```json
{
  "id": "abc123...",
  "nome": "Sistemas de Informação",
  "codigo": "SI-2026",
  "descricao": "Curso de graduação em Sistemas de Informação",
  "criadoEm": "2026-01-16T23:30:00.000Z",
  "alunosCount": 0
}
```

---

### 2. Listar Todos os Cursos

**Endpoint**: `GET /api/cursos`  
**Autenticação**: Requer token JWT

```bash
curl http://localhost:3000/api/cursos \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta** (200 OK):
```json
[
  {
    "id": "abc123...",
    "nome": "Sistemas de Informação",
    "codigo": "SI-2026",
    "descricao": "Curso de graduação em Sistemas de Informação",
    "criadoEm": "2026-01-16T23:30:00.000Z",
    "alunosCount": 5
  },
  {
    "id": "def456...",
    "nome": "Ciência da Computação",
    "codigo": "CC-2026",
    "descricao": null,
    "criadoEm": "2026-01-15T20:00:00.000Z",
    "alunosCount": 12
  }
]
```

---

### 3. Buscar Curso por ID

**Endpoint**: `GET /api/cursos/:id`  
**Autenticação**: Requer token JWT

```bash
curl http://localhost:3000/api/cursos/abc123... \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 4. Atualizar Curso

**Endpoint**: `PUT /api/cursos/:id`  
**Permissões**: `coordinator` ou `scholarship_holder`

```bash
curl -X PUT http://localhost:3000/api/cursos/abc123... \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Sistemas de Informação - Atualizado",
    "descricao": "Nova descrição do curso"
  }'
```

---

### 5. Deletar Curso

**Endpoint**: `DELETE /api/cursos/:id`  
**Permissões**: `coordinator` apenas

> ⚠️ **Atenção**: Não é possível deletar um curso que possui alunos vinculados

```bash
curl -X DELETE http://localhost:3000/api/cursos/abc123... \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 👨‍🎓 Criação de Usuário com Perfil de Aluno

### Exemplo 1: Criar Aluno Básico (Sem Curso)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "SenhaSegura123"
  }'
```

**O que acontece**:
- ✅ Cria registro na tabela `usuario`
- ✅ Cria registro na tabela `aluno` automaticamente com `role: ALUNO`

---

### Exemplo 2: Criar Aluno Vinculado a um Curso

```bash
# Primeiro, obtenha o ID do curso (veja "Listar Todos os Cursos")
CURSO_ID="abc123..."

# Depois, crie o usuário aluno vinculado
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria@example.com",
    "senha": "SenhaSegura123",
    "aluno": {
      "cursoId": "'$CURSO_ID'",
      "matricula": "2026001"
    }
  }'
```

**O que acontece**:
- ✅ Cria `usuario`
- ✅ Cria `aluno` vinculado ao curso com matrícula
- ✅ Campo `role` do aluno = `ALUNO`

---

### Exemplo 3: Criar Tutor (Automaticamente Vira Aluno com Role TUTOR)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Pedro Tutor",
    "email": "pedro.tutor@example.com",
    "senha": "SenhaSegura123",
    "tutor": {
      "area": "Tecnologia da Informação",
      "nivel": "Senior"
    },
    "aluno": {
      "cursoId": "'$CURSO_ID'",
      "matricula": "2026002"
    }
  }'
```

**O que acontece**:
- ✅ Cria `usuario`
- ✅ Cria perfil `tutor`
- ✅ Cria `aluno` com `role: TUTOR` e `tutorProfileId` vinculado

---

### Exemplo 4: Criar Tutor + Bolsista (Role TUTOR_BOLSISTA)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Ana Completo",
    "email": "ana@example.com",
    "senha": "SenhaSegura123",
    "tutor": {
      "area": "TI",
      "nivel": "Pleno"
    },
    "bolsista": {
      "anoIngresso": 2024,
      "curso": "Sistemas"
    },
    "aluno": {
      "matricula": "2026003"
    }
  }'
```

**O que acontece**:
- ✅ Cria `usuario`
- ✅ Cria perfil `tutor` E `bolsista`
- ✅ Cria `aluno` com `role: TUTOR_BOLSISTA` e IDs dos perfis vinculados

---

## 🔍 Consulta de Alunos

### 1. Listar Todos os Alunos

**Endpoint**: `GET /api/alunos`  
**Permissões**: `coordinator`, `tutor` ou `scholarship_holder`

```bash
curl http://localhost:3000/api/alunos \
  -H "Authorization: Bearer SEU_TOKEN"
```

**Resposta**:
```json
[
  {
    "id": "aluno123...",
    "usuarioId": "user123...",
    "cursoId": "curso123...",
    "matricula": "2026001",
    "role": "ALUNO",
    "usuario": {
      "id": "user123...",
      "nome": "Maria Santos",
      "email": "maria@example.com"
    },
    "curso": {
      "id": "curso123...",
      "nome": "Sistemas de Informação",
      "codigo": "SI-2026"
    }
  }
]
```

---

### 2. Filtrar Alunos por Curso

```bash
curl "http://localhost:3000/api/alunos?cursoId=curso123..." \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 3. Filtrar Alunos por Role

```bash
# Listar apenas tutores
curl "http://localhost:3000/api/alunos?role=TUTOR" \
  -H "Authorization: Bearer SEU_TOKEN"

# Listar apenas bolsistas
curl "http://localhost:3000/api/alunos?role=BOLSISTA" \
  -H "Authorization: Bearer SEU_TOKEN"

# Listar tutores que também são bolsistas
curl "http://localhost:3000/api/alunos?role=TUTOR_BOLSISTA" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 4. Filtrar por Curso E Role (Combinar Filtros)

```bash
curl "http://localhost:3000/api/alunos?cursoId=curso123...&role=TUTOR" \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

### 5. Buscar Aluno Específico

**Endpoint**: `GET /api/alunos/:id`

```bash
curl http://localhost:3000/api/alunos/aluno123... \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## ✏️ Atualização de Dados do Aluno

### Atualizar Curso ou Matrícula

**Endpoint**: `PUT /api/alunos/:id`  
**Permissões**: `coordinator` ou `scholarship_holder`

```bash
curl -X PUT http://localhost:3000/api/alunos/aluno123... \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cursoId": "novoCurso456...",
    "matricula": "2026999"
  }'
```

---

## 🔄 Atribuir/Remover Papéis (Sincronizado com Aluno.role)

### Atribuir Papel de Tutor

**Endpoint**: `PATCH /api/users/:id/atribuir-papel`  
**Permissões**: `coordinator`

```bash
curl -X PATCH http://localhost:3000/api/users/user123.../atribuir-papel \
  -H "Authorization: Bearer SEU_TOKEN_COORDINATOR" \
  -H "Content-Type: application/json" \
  -d '{
    "papel": "tutor",
    "acao": "atribuir"
  }'
```

**O que acontece**:
- ✅ Cria perfil `tutor` para o usuário
- ✅ Atualiza `aluno.role` para `TUTOR` (ou `TUTOR_BOLSISTA` se já for bolsista)
- ✅ Vincula `aluno.tutorProfileId` ao perfil criado

---

### Remover Papel de Tutor

```bash
curl -X PATCH http://localhost:3000/api/users/user123.../atribuir-papel \
  -H "Authorization: Bearer SEU_TOKEN_COORDINATOR" \
  -H "Content-Type: application/json" \
  -d '{
    "papel": "tutor",
    "acao": "remover"
  }'
```

**O que acontece**:
- ✅ Remove perfil `tutor`
- ✅ Atualiza `aluno.role`:
  - Se for `TUTOR` → vira `ALUNO`
  - Se for `TUTOR_BOLSISTA` → vira `BOLSISTA`
- ✅ Remove `aluno.tutorProfileId`

---

## 🎯 Fluxos Comuns

### Fluxo 1: Cadastrar Novo Aluno no Sistema

1. **Criar um curso** (se ainda não existir)
   ```bash
   POST /api/cursos
   ```

2. **Criar usuário aluno vinculado ao curso**
   ```bash
   POST /api/users
   Body: { nome, email, senha, aluno: { cursoId, matricula } }
   ```

3. **Verificar que aluno foi criado**
   ```bash
   GET /api/alunos?matricula=2026001
   ```

---

### Fluxo 2: Promover Aluno a Tutor

1. **Buscar o ID do usuário**
   ```bash
   GET /api/users
   ```

2. **Atribuir papel de tutor**
   ```bash
   PATCH /api/users/:id/atribuir-papel
   Body: { papel: "tutor", acao: "atribuir" }
   ```

3. **Verificar que role foi atualizado**
   ```bash
   GET /api/alunos?role=TUTOR
   ```

---

### Fluxo 3: Transferir Aluno de Curso

1. **Buscar ID do novo curso**
   ```bash
   GET /api/cursos
   ```

2. **Atualizar curso do aluno**
   ```bash
   PUT /api/alunos/:id
   Body: { cursoId: "novoCursoId" }
   ```

---

## 📊 Verificação no Prisma Studio

Para visualizar os dados diretamente no banco:

```bash
npx prisma studio
```

**Tabelas para verificar**:
- `usuario` - Todos os usuários cadastrados
- `aluno` - Perfil de aluno (deve ter 1 para cada usuário)
- `curso` - Cursos cadastrados
- `tutor` - Perfis de tutor
- `bolsista` - Perfis de bolsista
- `coordenador` - Perfis de coordenador

---

## ❓ Perguntas Frequentes

### P: Por que todo usuário tem um registro de aluno?

**R**: Segundo a arquitetura do sistema, **Aluno é o perfil base** de todos os usuários. Coordenador, Tutor e Bolsista são perfis adicionais que podem ser atribuídos.

---

### P: Posso criar um aluno sem vincular a um curso?

**R**: Sim! O campo `cursoId` é opcional. O aluno pode ser criado sem curso e depois você pode vinculá-lo usando `PUT /api/alunos/:id`.

---

### P: O que acontece se eu deletar um usuário?

**R**: Por conta do `onDelete: Cascade` no schema Prisma, quando você deleta um usuário:
- ✅ Registro `aluno` é deletado automaticamente
- ✅ Perfis `tutor`, `bolsista`, `coordenador` são deletados automaticamente

---

### P: Posso ter um aluno em mais de um curso?

**R**: Não. O relacionamento atual é N:1 (muitos alunos para um curso). Se precisar dessa funcionalidade, seria necessário modificar o schema.

---

## 🔒 Permissões por Endpoint

| Endpoint | Método | Permissões Necessárias |
|----------|--------|------------------------|
| `/api/cursos` | POST | `coordinator`, `scholarship_holder` |
| `/api/cursos` | GET | Autenticado |
| `/api/cursos/:id` | GET | Autenticado |
| `/api/cursos/:id` | PUT | `coordinator`, `scholarship_holder` |
| `/api/cursos/:id` | DELETE | `coordinator` |
| `/api/alunos` | GET | `coordinator`, `tutor`, `scholarship_holder` |
| `/api/alunos/:id` | GET | Autenticado |
| `/api/alunos/:id` | PUT | `coordinator`, `scholarship_holder` |
| `/api/users/:id/atribuir-papel` | PATCH | `coordinator` |

---

## 🚨 Erros Comuns

### Erro 400: "Já existe um curso com este código"

**Solução**: O código do curso deve ser único. Escolha outro código.

---

### Erro 400: "Não é possível deletar curso com alunos vinculados"

**Solução**: Primeiro desvincule ou delete os alunos do curso, depois delete o curso.

---

### Erro 403: "Sem permissão"

**Solução**: Verifique se seu token JWT tem o role necessário (coordinator, tutor, etc). Faça login com um usuário que tenha as permissões adequadas.

---

### Erro 404: "Curso não encontrado"

**Solução**: Verifique se o `cursoId` está correto. Use `GET /api/cursos` para listar todos os cursos disponíveis.

---

## 📞 Suporte

Para mais informações ou problemas, consulte:
- [README.md](../README.md) - Documentação geral do projeto
- [openapi.yaml](../openapi.yaml) - Especificação completa da API
- [Swagger UI](http://localhost:3000/api-docs) - Documentação interativa
