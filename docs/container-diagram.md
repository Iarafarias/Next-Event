# Next-Event — Diagrama de Contêiner (Mermaid)

```mermaid
%% Diagrama de alto nível dos contêineres
flowchart LR
  subgraph Users[Usuários]
    U1[Aluno]
    U2[Professor]
    U3[Administrador]
  end

  U1 -->|HTTPS/JSON| Web[Aplicação Web (React/Next.js)]
  U2 -->|HTTPS/JSON| Web
  U3 -->|HTTPS/JSON| Web

  Web -->|HTTPS/JSON| API[API Backend (Node.js/Express)]
  API -->|ORM: Prisma| DB[(PostgreSQL)]
  API -->|Leitura/Escrita| Files[(Armazenamento de Arquivos — uploads/certificates)]

  classDef web fill:#7ec8e3,stroke:#333,stroke-width:1px;
  classDef api fill:#f9d67a,stroke:#333,stroke-width:1px;
  classDef db fill:#b3e283,stroke:#333,stroke-width:1px;
  classDef files fill:#d1c4e9,stroke:#333,stroke-width:1px;

  class Web web
  class API api
  class DB db
  class Files files
```

Notas:

- Aplicação Web: Interface React/Next.js consumindo a API via HTTPS/JSON.
- API Backend: Serviços REST (Express), documentação via Swagger, regras de negócio.
- Banco de Dados: PostgreSQL, acesso via Prisma.
- Armazenamento de Arquivos: diretório local para uploads/certificados.
