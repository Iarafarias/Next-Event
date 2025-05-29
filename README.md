# NextEvent API

API de cadastro de usuários para o sistema de eventos universitários.

## 🚀 Tecnologias Utilizadas
- Node.js
- TypeScript
- Express
- SOLID & Clean Architecture

## 📦 Funcionalidades
- Cadastro de usuário com validação de dados
- Estrutura pronta para expansão (CRUD, autenticação, eventos, etc)

## 🔥 Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/NextEvent.git
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
- Faça uma requisição POST para `/api/users` com o seguinte JSON:
  ```json
  {
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }
  ```
- Resposta esperada:
  ```json
  {
    "id": "...",
    "name": "João Silva",
    "email": "joao@email.com"
  }
  ```

## 📁 Estrutura do Projeto
```
src/
  domain/
    entities/
    repositories/
  usecases/
  infra/
  presentation/
```

## ✨ Próximos Passos
- Listagem, atualização e remoção de usuários
- Integração com banco de dados
- Hash de senha e autenticação JWT
- Cadastro e gerenciamento de eventos

---

Feito com 💙 para a disciplina de Projeto de Extensão.
