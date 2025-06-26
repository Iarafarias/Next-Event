# NextEvent API

API de cadastro de usuários para o sistema de eventos universitários.

## 🚀 Tecnologias Utilizadas
- Node.js
- TypeScript
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
  domain/
    user/
      entities/
      repositories/
  application/
    user/
      dtos/
      use-cases/
  infrastructure/
    user/
      repositories/
  presentation/
    user/
      controllers/
      routes/
```

## ✨ Próximos Passos
- Autenticação JWT
- Cadastro e gerenciamento de eventos

---
