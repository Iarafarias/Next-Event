Resumo da implementação — Aluno e Curso

O que foi implementado

- Adicionados no `prisma/schema.prisma` os novos elementos: 
  - `enum StudentRole` com valores `ALUNO`, `TUTOR`, `BOLSISTA`, `TUTOR_BOLSISTA`.
  - `model Curso` (id, nome, codigo, descricao, criadoEm) e relação com `Aluno`.
  - `model Aluno` (id, usuarioId, cursoId, matricula, role, tutorProfileId, bolsistaProfileId, criadoEm, atualizadoEm) com relações:
    - `usuario` (1:1) -> `Usuario` (campo `usuarioId`, relação nomeada `UsuarioAluno`)
    - `curso` (N:1) -> `Curso`
    - `tutor` (N:1) -> `Tutor` (relação `TutorAlunos`)
    - `bolsista` (1:1) -> `Bolsista` (relação `BolsistaAluno`, campo `bolsistaProfileId` marcado `@unique`)

Arquivos alterados / gerados

- Schema: [prisma/schema.prisma](prisma/schema.prisma)
- Migração gerada: [prisma/migrations/20260114220203_add_aluno_curso/migration.sql](prisma/migrations/20260114220203_add_aluno_curso/migration.sql)

Comandos principais (executar na raiz do projeto)

1) Gerar/atualizar client Prisma:

```bash
npx prisma generate
```

2) Aplicar migração (se ainda não aplicou):

```bash
npx prisma migrate dev --name add-aluno-curso
```

3) Abrir Prisma Studio para inspecionar dados:

```bash
npx prisma studio
```

Como testar manualmente

Opção A — Usando `Prisma Studio`:
- Rode `npx prisma studio` e verifique as tabelas `Usuario`, `Curso`, `Aluno`, `Tutor`, `Bolsista`.
- Crie um `Usuario`, depois crie um `Curso`, e crie um `Aluno` vinculando `usuarioId` e `cursoId`.
- Verifique as relações (se aluno.role = `TUTOR` ou `BOLSISTA`, confira se os perfis `Tutor`/`Bolsista` estão populados conforme esperado).

Opção B — Script Node rápido (exemplo):

- Crie um arquivo `scripts/test-aluno-curso.js` com o seguinte conteúdo:

```js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main(){
  // criar curso
  const curso = await prisma.curso.create({ data: { nome: 'Engenharia', codigo: 'ENG-01' } });

  // criar usuário (substitua campos conforme seu model Usuario)
  const usuario = await prisma.usuario.create({ data: { nome: 'Maria Silva', email: 'maria@example.com', senha: 'senha123' } });

  // criar aluno vinculado ao usuário e ao curso
  const aluno = await prisma.aluno.create({
    data: {
      usuario: { connect: { id: usuario.id } },
      curso: { connect: { id: curso.id } },
      matricula: '2026.0001',
      role: 'ALUNO'
    },
    include: { usuario: true, curso: true }
  });

  console.log('Aluno criado:', aluno);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
```

- Executar (certifique-se de usar Node com `type: module` ou adaptar para CommonJS):

```bash
node scripts/test-aluno-curso.js
```

Opção C — Consultas SQL (exemplo PostgreSQL)

- Listar alunos e cursos:

```sql
SELECT a.id, a.matricula, a.role, u.nome AS usuario_nome, c.nome AS curso_nome
FROM aluno a
JOIN usuario u ON u.id = a.usuarioId
LEFT JOIN curso c ON c.id = a.cursoId;
```

Observações e pontos de atenção

- Relacionamentos one-to-one exigem campos `@unique` no lado definidor. O campo `bolsistaProfileId` foi marcado `@unique` para que `Aluno` -> `Bolsista` seja one-to-one.
- Se ocorrer erro EPERM ao rodar `npx prisma generate`, pare processos Node/VSCode, remova `node_modules/.prisma/client`, rode o comando em um terminal com privilégios administrativos e/ou reinicie a máquina.
- O modelo `Aluno` referencia `Usuario`, `Tutor` e `Bolsista`. Ao criar `Tutor`/`Bolsista` via fluxo existente do projeto, você pode querer sincronizar a criação de um registro correspondente em `Aluno` (opcional — não implementado automaticamente).

Próximos passos úteis (opcional)

- Criar um `prisma/seed.ts` para popular `Curso` e criar um `Usuario` + `Aluno` de exemplo automaticamente.
- Atualizar lógica do backend para criar/atualizar automaticamente o registro `Aluno` ao criar `Tutor` ou `Bolsista`.

Se quiser, eu crio também o `scripts/test-aluno-curso.js` ou um `prisma/seed.ts` e executo testes locais para verificar tudo funcionando.
