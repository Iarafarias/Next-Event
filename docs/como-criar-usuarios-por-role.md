# Como criar usuários por tipo de role (Coordenador, Tutor, Bolsista)

Este guia explica como criar usuários e atribuir papéis (roles) no Next-Event API para os tipos: Coordenador, Tutor e Bolsista.

## Visão geral

- Papéis disponíveis (conforme `prisma/schema.prisma`): `COORDENADOR`, `TUTOR`, `BOLSISTA`.
- Dois caminhos possíveis:
  - Criar o usuário já com um ou mais perfis (papéis) no corpo do `POST /api/users`.
  - Criar o usuário básico e, depois, atribuir/remover papéis via `PATCH /api/users/:id/atribuir-papel`.
- Autenticação:
  - `POST /api/users` não exige token.
  - Endpoints de listagem e atribuição/remoção de papéis exigem JWT e, em geral, papel de coordenador.
  - Login: `POST /api/users/login`.

## Endpoints principais

- Criar usuário: `POST /api/users`
- Login: `POST /api/users/login`
- Listar usuários: `GET /api/users` (requer `coordinator`)
- Buscar por ID: `GET /api/users/:id`
- Atualizar: `PUT /api/users/:id`
- Remover: `DELETE /api/users/:id` (requer `coordinator`)
- Atribuir/remover papel: `PATCH /api/users/:id/atribuir-papel` (requer `coordinator`)
- Listar por papel:
  - Coordenadores: `GET /api/users/coordenadores` (requer `coordinator`)
  - Tutores: `GET /api/users/tutores` (requer `coordinator`)
  - Bolsistas: `GET /api/users/bolsistas` (requer `coordinator` ou `tutor`)

## Estrutura de criação com perfis

No `POST /api/users`, você pode enviar objetos opcionais para `coordenador`, `tutor` e/ou `bolsista`. Campos aceitos (todos opcionais):

- `coordenador`: `area` (string), `nivel` (string)
- `tutor`: `area` (string), `nivel` (string), `capacidadeMaxima` (number; padrão 5)
- `bolsista`: `anoIngresso` (number), `curso` (string)

### Exemplo: criar Coordenador

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Coordenadora",
    "email": "maria.coord@example.com",
    "senha": "SenhaSegura123",
    "status": "ATIVO",
    "coordenador": { "area": "Eventos", "nivel": "Senior" }
  }'
```

### Exemplo: criar Tutor

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Tutor",
    "email": "joao.tutor@example.com",
    "senha": "SenhaSegura123",
    "tutor": { "area": "Tecnologia", "nivel": "Pleno", "capacidadeMaxima": 8 }
  }'
```

### Exemplo: criar Bolsista

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Ana Bolsista",
    "email": "ana.bolsista@example.com",
    "senha": "SenhaSegura123",
    "bolsista": { "anoIngresso": 2024, "curso": "Engenharia" }
  }'
```

### Exemplo: criar usuário com múltiplos papéis

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Carlos Multi",
    "email": "carlos.multi@example.com",
    "senha": "SenhaSegura123",
    "coordenador": { "area": "Operações" },
    "tutor": { "area": "TI", "nivel": "Senior" }
  }'
```

## Atribuir ou remover papéis após a criação

Para alterar papéis de um usuário existente, use `PATCH /api/users/:id/atribuir-papel` com JWT de um usuário `coordinator`:

- Corpo (`application/json`):
  - `papel`: `"coordenador" | "tutor" | "bolsista"`
  - `acao`: `"atribuir" | "remover"`

### Exemplo: atribuir papel de Tutor a um usuário

```bash
curl -X PATCH http://localhost:3000/api/users/USER_ID/atribuir-papel \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{ "papel": "tutor", "acao": "atribuir" }'
```

### Exemplo: remover papel de Bolsista de um usuário

```bash
curl -X PATCH http://localhost:3000/api/users/USER_ID/atribuir-papel \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{ "papel": "bolsista", "acao": "remover" }'
```

## Login e uso do token

1. Faça login para obter o token:

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "maria.coord@example.com", "senha": "SenhaSegura123" }'
```

2. Use o `token` no cabeçalho `Authorization: Bearer ...` para acessar rotas protegidas.

## Listagem por papel

```bash
# Coordenadores (requer coordinator)
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/users/coordenadores

# Tutores (requer coordinator)
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/users/tutores

# Bolsistas (requer coordinator ou tutor)
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/users/bolsistas
```

## Erros comuns

- 400: Campos obrigatórios ausentes (`nome`, `email`, `senha`) ou usuário já existe.
- 401: Token ausente ou inválido em rotas protegidas.
- 403: Sem permissão (ex.: atribuição de papéis sem ser `coordinator`).
- 404: Usuário não encontrado ao operar por `:id`.

## Referências

- Modelos e enums: `prisma/schema.prisma`
- DTO de criação: `src/application/user/dtos/CreateUserDTO.ts`
- Caso de uso de criação: `src/application/user/use-cases/CreateUserUseCase.ts`
- Rotas de usuário: `src/presentation/user/routes/userRoutes.ts`
- Atribuição de papéis: `src/application/user/use-cases/AtribuirPapelUseCase.ts`, `src/application/user/dtos/AtribuirPapelDTO.ts`
