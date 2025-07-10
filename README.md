# Sistema de Gerenciamento de Certificados

Sistema para gerenciamento e validação de certificados de alunos, desenvolvido com Node.js, TypeScript e PostgreSQL.

## 🚀 Funcionalidades

### Administrador
- Criar solicitações mensais de certificados
- Aprovar/rejeitar certificados submetidos
- Visualizar relatórios por aluno
- Acompanhar estatísticas de certificados (total de horas, status, etc.)

### Aluno (Participante)
- Submeter certificados para períodos solicitados
- Acompanhar status das submissões
- Visualizar histórico de certificados

## 🛠 Tecnologias

- Node.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Express.js
- JWT para autenticação

- Express
- SOLID & Clean Architecture
- DDD (Domain-Driven Design)

## 📦 Funcionalidades
- Cadastro de usuário com validação de dados
- Listagem, busca, atualização e remoção de usuários (CRUD)
- Matrícula e CPF únicos, obrigatórios e imutáveis
- Validação de matrícula (6 dígitos) e CPF (validação completa)
- Estrutura pronta para expansão (autenticação, eventos, etc)

## 🔥 Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Iarafarias/Next-Event.git
   cd NextEvent
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Inicie a API em modo desenvolvimento:**
   ```bash
   npm run dev
   ```
4. **Acesse:**
   - A API estará disponível em `http://localhost:3000/api/users`

## 🧪 Testando com Insomnia/Postman
- Faça uma requisição **POST** para `/api/users` com o seguinte JSON:
  ```json
  {
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456",
    "matricula": "123456",
    "cpf": "12345678909"
  }
  ```
- Resposta esperada:
  ```json
  {
    "matricula": "123456",
    "name": "João Silva",
    "email": "joao@email.com"
  }
  ```

- Para listar todos os usuários (**GET**):
  - `GET /api/users`
- Para buscar por matrícula (**GET**):
  - `GET /api/users/:id` (id = UUID, mas resposta mostra matrícula)
- Para atualizar (**PUT**):
  - `PUT /api/users/:id` (não envie matrícula/cpf, pois são imutáveis)
- Para remover (**DELETE**):
  - `DELETE /api/users/:id`

## 📁 Estrutura do Projeto

```
src/
├── application/          # Casos de uso e DTOs
│   └── certificate/
│       ├── dtos/
│       └── use-cases/
├── domain/              # Regras de negócio e entidades
│   └── certificate/
│       ├── entities/
│       └── repositories/
├── infrastructure/      # Implementações externas
│   └── certificate/
│       └── repositories/
└── presentation/        # Controllers e rotas
    └── certificate/
        ├── controllers/
        └── routes/
```

## 🔄 Fluxo do Sistema

1. Administrador cria solicitação de certificados para um período
2. Alunos são notificados da solicitação
3. Alunos submetem seus certificados
4. Administrador revisa e aprova/rejeita certificados
5. Sistema gera relatórios de horas por aluno

## 📝 Modelos de Dados

### Certificate
- id: string
- userId: string
- requestId: string
- title: string
- description: string
- institution: string
- workload: number
- startDate: Date
- endDate: Date
- certificateUrl: string
- status: 'pending' | 'approved' | 'rejected'
- adminComments?: string

### CertificateRequest
- id: string
- month: number
- year: number
- startDate: Date
- endDate: Date
- status: 'open' | 'closed'
- description: string

## 🔐 Autenticação e Autorização

- JWT para autenticação
- Middleware de autorização por roles:
  - admin: Acesso total
  - participant: Acesso limitado a suas próprias submissões

## 📡 API Endpoints

### Certificados
```http
POST /api/certificates
GET /api/certificates/user/:userId
PATCH /api/certificates/:id/status
GET /api/certificates/report/:userId
```

### Solicitações
```http
POST /api/certificates/requests
GET /api/certificates/requests/active
GET /api/certificates/reports/monthly/:year/:month
```

## ⚙️ Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
PORT=3000
```

4. Execute as migrações:
```bash
npx prisma migrate dev
```

5. Inicie o servidor:
```bash
npm run dev
```

## 🧪 Testes

```bash
npm test
```

## 📦 Deploy

1. Build do projeto:
```bash
npm run build
```
2. Inicie em produção:
```bash
npm start
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

## ✨ Próximos Passos

- Cadastro e gerenciamento de eventos

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
