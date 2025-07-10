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

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
