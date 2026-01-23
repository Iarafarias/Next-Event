# 🎓 Next-Event API

> Sistema completo de gestão de certificados acadêmicos, tutoria de alunos e relatórios administrativos desenvolvido com Clean Architecture.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Iarafarias/Next-Event)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue.svg)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 🎯 Sobre o Projeto

O **Next-Event** é uma plataforma robusta para gerenciamento acadêmico que permite:

- 👤 **Participantes/Bolsistas** fazem upload de certificados em PDF
- 👨‍💼 **Coordenadores** validam (aprovam/rejeitam) os certificados
- 👨‍🏫 **Tutores** acompanham alunos e geram relatórios de tutoria
- 🔔 **Sistema** envia notificações automáticas sobre mudanças de status
- 📊 **Relatórios** detalhados e consolidados por período
- 🔐 **Autenticação JWT** com controle de permissões baseado em roles

---

## ✨ Funcionalidades

### 🔐 Sistema de Usuários
- Cadastro e autenticação JWT
- Múltiplos perfis: `Coordenador`, `Tutor`, `Bolsista`, `Aluno`
- Middleware de autorização por role
- Gestão completa de perfil de usuário

### 📜 Gestão de Certificados
- Upload de arquivos PDF com parsing automático
- Metadados: título, instituição, carga horária, período
- Status: `PENDENTE`, `APROVADO`, `REJEITADO`
- Comentários do administrador/coordenador
- Listagem com filtros avançados
- Categorias: Eventos, Monitoria, Estudos Individuais

### 🔔 Sistema de Notificações
- Notificações automáticas na validação de certificados
- Contagem de notificações não lidas
- Marcar como lida (individual ou em lote)
- Tipos: aprovação, rejeição, anúncios gerais

### 👥 Gestão de Tutoria
- Alocação de tutores para alunos
- Formulários de acompanhamento
- Períodos de tutoria configuráveis
- Avaliação de tutoria (tutor e aluno)
- Controle de capacidade máxima por tutor

### 📊 Sistema de Relatórios
- Relatório de Aluno (atividades e observações)
- Relatório de Tutor (alunos atendidos)
- Relatório de Certificados (validações)
- Relatório de Acompanhamento
- Relatório de Avaliação
- Relatório Consolidado (estatísticas completas)

### 🎓 Gestão de Cursos
- CRUD completo de cursos
- Vinculação de alunos a cursos
- Coordenadores por curso

---

## 🛠️ Tecnologias e Dependências

### Backend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **TypeScript** | 5.8.3 | Superset tipado do JavaScript |
| **Express.js** | 4.18.2 | Framework web minimalista |

### Banco de Dados
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **PostgreSQL** | Latest | Banco de dados relacional |
| **Prisma ORM** | 6.11.1 | ORM moderno para Node.js |

### Autenticação e Segurança
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **jsonwebtoken** | 9.0.2 | Geração e validação de JWT |
| **bcryptjs** | 3.0.2 | Hash de senhas |

### Upload e Processamento
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Multer** | 2.0.1 | Middleware para upload de arquivos |
| **pdf-parse** | 1.1.1 | Parser de arquivos PDF |

### Documentação
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Swagger UI Express** | 5.0.1 | Interface Swagger UI |
| **OpenAPI** | 3.0.3 | Especificação da API |

### Logging e Utilitários
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Winston** | 3.19.0 | Logger profissional |
| **CORS** | 2.8.5 | Middleware CORS |
| **dotenv** | 17.0.1 | Gerenciamento de variáveis de ambiente |

### Testes
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Jest** | 30.2.0 | Framework de testes |
| **Supertest** | 7.1.1 | Testes de API HTTP |
| **Faker.js** | 10.2.0 | Geração de dados fake |

### Desenvolvimento
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **ts-node-dev** | 2.0.0 | Execução TypeScript com hot reload |
| **Prettier** | 3.8.0 | Formatador de código |

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18 ou superior
- **Docker** e **Docker Compose**
- **Git**
- **npm** ou **yarn** (vem com Node.js)

---

## 🚀 Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone https://github.com/Iarafarias/Next-Event.git
cd Next-Event
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações (veja seção [Variáveis de Ambiente](#-variáveis-de-ambiente) para detalhes).

---

## 🗄️ Configuração do Banco de Dados

### 1. Iniciar PostgreSQL com Docker

```bash
cd database
docker-compose up -d
cd ..
```

**Configurações padrão do PostgreSQL:**
- **Host:** `localhost`
- **Porta:** `5433`
- **Database:** `nextevent_db`
- **Usuário:** `nextevent_user`
- **Senha:** `nextevent_password`

### 2. Executar Migrações do Prisma

```bash
# Aplicar migrações
npx prisma migrate dev

# Gerar cliente Prisma
npx prisma generate
```

### 3. (Opcional) Popular Banco com Dados de Exemplo

```bash
npx prisma db seed
```

### 4. Visualizar Banco de Dados

Para abrir o Prisma Studio e visualizar os dados:

```bash
npm run db:studio
```

Acesse: `http://localhost:5555`

---

## ▶️ Execução da Aplicação

### Modo Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: **`http://localhost:3000`**

### Modo Produção

```bash
# Compilar TypeScript
npm run build

# Executar aplicação compilada
npm start
```

### Verificar Status da API

```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "uptime": 123.456
}
```

---

## 📁 Estrutura do Projeto

O projeto segue os princípios da **Clean Architecture**, separando as responsabilidades em camadas bem definidas:

```
Next-Event/
├── src/
│   ├── domain/              # 🎯 Camada de Domínio (Regras de Negócio)
│   │   ├── user/           # Entidades e interfaces de usuário
│   │   ├── certificate/    # Entidades e interfaces de certificados
│   │   ├── notification/   # Entidades e interfaces de notificações
│   │   ├── aluno/          # Entidades de aluno
│   │   ├── curso/          # Entidades de curso
│   │   ├── relatorio/      # Entidades de relatórios
│   │   └── ...             # Outros domínios
│   │
│   ├── application/        # 💼 Camada de Aplicação (Casos de Uso)
│   │   ├── user/           # Casos de uso de usuário
│   │   ├── certificate/    # Casos de uso de certificados
│   │   ├── notification/   # Casos de uso de notificações
│   │   ├── relatorio/      # Casos de uso de relatórios
│   │   └── ...             # Outros casos de uso
│   │
│   ├── infrastructure/     # 🔧 Camada de Infraestrutura (Implementações Técnicas)
│   │   ├── database/       # Configuração do banco de dados
│   │   ├── repositories/   # Implementações de repositórios
│   │   ├── logger/         # Configuração de logs (Winston)
│   │   └── swagger/        # Configuração do Swagger
│   │
│   ├── presentation/       # 🌐 Camada de Apresentação (Controllers e Rotas)
│   │   ├── user/           # Controllers e rotas de usuário
│   │   ├── certificate/    # Controllers e rotas de certificados
│   │   ├── notification/   # Controllers e rotas de notificações
│   │   ├── middlewares/    # Middlewares (auth, error handling, etc.)
│   │   └── ...             # Outros controllers
│   │
│   ├── config/             # ⚙️ Configurações gerais
│   └── main.ts             # 🚪 Ponto de entrada da aplicação
│
├── prisma/
│   ├── schema.prisma       # Schema do banco de dados
│   ├── migrations/         # Migrações do Prisma
│   └── seed.ts             # Script de seed
│
├── tests/                  # 🧪 Testes automatizados
│   ├── unit/              # Testes unitários
│   └── integration/       # Testes de integração
│
├── database/              # 🐳 Configuração Docker do PostgreSQL
│   └── docker-compose.yml
│
├── docs/                  # 📚 Documentação adicional
├── uploads/               # 📂 Arquivos enviados (certificados PDF)
├── openapi.yaml           # 📄 Especificação OpenAPI da API
├── package.json           # Dependências e scripts
├── tsconfig.json          # Configuração TypeScript
└── .env.example           # Exemplo de variáveis de ambiente
```

### Explicação das Camadas

#### 🎯 Domain (Domínio)
Contém as **entidades** e **interfaces** que representam as regras de negócio puras. Esta camada não depende de nenhuma outra camada.

- Entidades: `User`, `Certificate`, `Notification`, `Aluno`, `Tutor`, etc.
- Interfaces de repositórios
- Regras de validação de negócio

#### 💼 Application (Aplicação)
Contém os **casos de uso** (use cases) que orquestram a lógica de negócio. Cada caso de uso representa uma ação específica do sistema.

- `CreateUserUseCase`
- `UploadCertificateUseCase`
- `ValidateCertificateUseCase`
- `GenerateReportUseCase`

#### 🔧 Infrastructure (Infraestrutura)
Contém as **implementações técnicas** e detalhes de infraestrutura.

- Repositórios concretos (Prisma)
- Configuração de banco de dados
- Serviços externos
- Logging

#### 🌐 Presentation (Apresentação)
Contém os **controllers**, **rotas** e **middlewares** que lidam com requisições HTTP.

- Controllers (Express)
- Rotas da API
- Middlewares de autenticação
- Validação de entrada
- Tratamento de erros

---

## 📖 Documentação da API

### Swagger UI (Documentação Interativa)

Após iniciar o servidor, acesse a documentação interativa:

**🔗 http://localhost:3000/api-docs**

A documentação Swagger permite:
- ✅ Visualizar todos os endpoints disponíveis
- ✅ Testar requisições diretamente no navegador
- ✅ Ver exemplos de request/response
- ✅ Entender parâmetros e schemas

### Base URL

```
http://localhost:3000/api
```

### Principais Endpoints

#### 🔐 Autenticação

```http
POST /api/users/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "senha": "senha123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "nome": "Nome do Usuário",
    "email": "usuario@example.com"
  }
}
```

#### 👤 Usuários

```http
# Criar usuário
POST /api/users

# Listar todos os usuários (requer autenticação)
GET /api/users

# Buscar usuário por ID
GET /api/users/{id}

# Atualizar usuário
PUT /api/users/{id}

# Deletar usuário
DELETE /api/users/{id}

# Listar coordenadores
GET /api/users/coordenadores

# Listar tutores
GET /api/users/tutores

# Listar bolsistas
GET /api/users/bolsistas
```

#### 📜 Certificados

```http
# Upload de certificado (multipart/form-data)
POST /api/certificates/upload

# Listar todos os certificados
GET /api/certificates

# Listar certificados de um usuário
GET /api/certificates/user/{userId}

# Download de certificado
GET /api/certificates/{id}/download

# Validar certificado (coordenador)
PATCH /api/certificates/{id}/status
```

#### 🔔 Notificações

```http
# Listar notificações do usuário logado
GET /api/notifications

# Contar notificações não lidas
GET /api/notifications/unread-count

# Marcar notificação como lida
PATCH /api/notifications/{id}/read

# Marcar todas como lidas
PATCH /api/notifications/mark-all-read
```

#### 📊 Relatórios

```http
# Listar relatórios
GET /api/relatorios

# Relatórios de aluno
GET /api/relatorio-aluno
POST /api/relatorio-aluno

# Relatórios de tutor
GET /api/relatorio-tutor
POST /api/relatorio-tutor

# Relatório consolidado
POST /api/bolsistas/relatorio-consolidado
```

#### 🎓 Cursos e Alunos

```http
# Listar cursos
GET /api/cursos

# Criar curso
POST /api/cursos

# Listar alunos
GET /api/alunos

# Criar aluno
POST /api/alunos
```

#### 👨‍🏫 Tutoria

```http
# Alocar tutor para aluno
POST /api/alocar-tutor-aluno

# Listar alocações
GET /api/alocar-tutor-aluno

# Formulários de acompanhamento
GET /api/form-acompanhamento
POST /api/form-acompanhamento

# Períodos de tutoria
GET /api/periodo-tutoria
POST /api/periodo-tutoria
```

---

## 🔐 Autenticação e Autorização

### Como Funciona

A API utiliza **JWT (JSON Web Tokens)** para autenticação. O fluxo é:

1. **Login:** Usuário envia credenciais (`email` e `senha`)
2. **Token:** API retorna um token JWT válido
3. **Requisições:** Cliente inclui o token no header `Authorization`
4. **Validação:** Middleware valida o token e extrai informações do usuário

### Exemplo de Uso

```bash
# 1. Fazer login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","senha":"senha123"}'

# Resposta: { "token": "eyJhbGc..." }

# 2. Usar token em requisições protegidas
curl http://localhost:3000/api/certificates \
  -H "Authorization: Bearer eyJhbGc..."
```

### Roles e Permissões

O sistema possui os seguintes perfis (roles):

| Role | Descrição | Permissões |
|------|-----------|------------|
| **Coordenador** | Gerencia certificados e relatórios | Validar certificados, gerar relatórios consolidados |
| **Tutor** | Acompanha alunos | Criar formulários de acompanhamento, gerar relatórios de tutoria |
| **Bolsista** | Aluno com bolsa | Upload de certificados, visualizar dashboard |
| **Aluno** | Estudante regular | Acesso básico ao sistema |

### Middleware de Autenticação

O middleware `authenticate` valida o token JWT:

```typescript
// Exemplo de rota protegida
router.get('/certificates', authenticate, certificateController.list);
```

---

## 🗃️ Banco de Dados

### Principais Entidades

O sistema utiliza **PostgreSQL** com **Prisma ORM**. Principais tabelas:

| Tabela | Descrição |
|--------|-----------|
| `usuario` | Usuários do sistema |
| `coordenador` | Perfil de coordenador |
| `tutor` | Perfil de tutor |
| `bolsista` | Perfil de bolsista |
| `aluno` | Estudantes |
| `curso` | Cursos da instituição |
| `certificado` | Certificados enviados |
| `notification` | Notificações do sistema |
| `relatorio` | Relatórios gerais |
| `relatorio_aluno` | Relatórios de aluno |
| `relatorio_tutor` | Relatórios de tutor |
| `relatorio_certificado` | Relatórios de certificados |
| `relatorio_acompanhamento` | Relatórios de acompanhamento |
| `relatorio_avaliacao` | Relatórios de avaliação |
| `form_acompanhamento` | Formulários de acompanhamento |
| `periodo_tutoria` | Períodos de tutoria |
| `alocar_tutor_aluno` | Alocação de tutores para alunos |
| `carga_horaria_minima` | Configuração de cargas horárias |
| `avaliacao_tutoria` | Avaliações de tutoria |

### Relacionamentos Principais

- Um **Usuário** pode ter múltiplos perfis (Coordenador, Tutor, Bolsista)
- Um **Bolsista** pode ter múltiplos **Certificados**
- Um **Tutor** pode ter múltiplos **Alunos** alocados
- Um **Relatório** pode ser de vários tipos (polimorfismo)

### Enums

```typescript
enum StatusAtivacao {
  ATIVO, INATIVO, PENDENTE
}

enum StatusCertificado {
  PENDENTE, APROVADO, REJEITADO
}

enum TipoRelatorio {
  ALUNO, TUTOR, CERTIFICADO, ACOMPANHAMENTO, AVALIACAO
}

enum CategoriaWorkload {
  EVENTOS, MONITORIA, ESTUDOS_INDIVIDUAIS
}

enum TipoAcessoAluno {
  ACESSO_TUTOR, ACESSO_BOLSISTA
}
```

---

## 🧪 Testes

### Executar Todos os Testes

```bash
npm test
```

### Testes Unitários

```bash
npm run test:unit
```

### Testes de Integração

```bash
npm run test:integration
```

### Cobertura de Testes

```bash
npm run test:coverage
```

### Modo Watch (Desenvolvimento)

```bash
npm run test:watch
```

### CI/CD

```bash
npm run test:ci
```

---

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

### Exemplo de `.env`

```env
# Database
DATABASE_URL="postgresql://nextevent_user:nextevent_password@localhost:5433/nextevent_db?schema=public"

# JWT
JWT_SECRET="sua-chave-secreta-super-segura-aqui-mude-em-producao"

# Server
PORT=3000

# Environment
NODE_ENV=development

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"
```

> ⚠️ **IMPORTANTE:** Use `.env.example` como template.

---

## 📜 Comandos Disponíveis

### Desenvolvimento

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor em modo desenvolvimento com hot reload |
| `npm run build` | Compila TypeScript para JavaScript (pasta `dist/`) |
| `npm start` | Inicia servidor em modo produção (requer build) |

### Banco de Dados

| Comando | Descrição |
|---------|-----------|
| `npm run db:generate` | Gera cliente Prisma |
| `npm run db:push` | Sincroniza schema com banco (sem migrations) |
| `npm run db:migrate` | Cria e aplica nova migration |
| `npm run db:deploy` | Aplica migrations pendentes (produção) |
| `npm run db:studio` | Abre Prisma Studio (GUI do banco) |
| `npm run db:seed` | Popula banco com dados de exemplo |

### Testes

| Comando | Descrição |
|---------|-----------|
| `npm test` | Executa todos os testes |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:unit` | Executa apenas testes unitários |
| `npm run test:integration` | Executa apenas testes de integração |
| `npm run test:coverage` | Gera relatório de cobertura |
| `npm run test:ci` | Executa testes para CI/CD |

---

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos abaixo:

### 1. Fork o Projeto

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/Next-Event.git
cd Next-Event
```

### 2. Crie uma Branch

```bash
git checkout -b feat/minha-nova-feature
```

### 3. Faça suas Alterações

Siga os padrões de código do projeto e adicione testes quando aplicável.

### 4. Commit suas Mudanças

Use o padrão de commits:

```bash
git commit -m 'feat: adiciona nova funcionalidade X'
```

**Padrão de Commits:**
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `refactor:` refatoração de código
- `test:` adição/modificação de testes
- `chore:` tarefas de manutenção
- `style:` formatação de código

### 5. Push para o GitHub

```bash
git push origin feat/minha-nova-feature
```

### 6. Abra um Pull Request

Descreva suas alterações detalhadamente no PR.

---

## 👥 Autores

- **Iara Farias** - Desenvolvedora Principal - [@Iarafarias](https://github.com/Iarafarias)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

**⭐ Se este projeto foi útil, deixe uma estrela!**

Desenvolvido com ❤️ por [Iara Farias](https://github.com/Iarafarias)

</div>
