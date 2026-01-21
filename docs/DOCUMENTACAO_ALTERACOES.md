# Documentação de Alterações - Sistema Next-Event

## Resumo das Principais Alterações

Durante esta sessão, implementamos uma significativa reestruturação do sistema para melhor gerenciar alunos, cursos e seus relacionamentos. As principais mudanças incluem:

### 1. **Nova Estrutura de Alunos e Cursos**

#### 1.1 Criação do Módulo Curso
- **Entidade Curso**: `src/domain/curso/entities/Curso.ts`
- **Repository Interface**: `src/domain/curso/repositories/ICursoRepository.ts`
- **Repository Implementation**: `src/infrastructure/curso/repositories/PostgresCursoRepository.ts`
- **Use Cases**: Criação e listagem de cursos
- **Controllers**: `src/presentation/curso/controllers/CursoController.ts`
- **Routes**: `src/presentation/curso/routes/cursoRoutes.ts`

#### 1.2 Reestruturação do Módulo Aluno
- **Mudança Conceitual**: Alunos agora podem acessar o sistema de duas formas:
  - `ACESSO_TUTOR`: Alunos que atuam como tutores
  - `ACESSO_BOLSISTA`: Alunos que são bolsistas
- **Novo Enum**: `TipoAcessoAluno` substituindo `TipoAluno`
- **Campo Atualizado**: `tipo` → `tipoAcesso`

### 2. **Mudanças no Schema do Banco de Dados**

#### 2.1 Model Curso
```prisma
model Curso {
  id            String         @id @default(uuid())
  nome          String
  codigo        String         @unique
  descricao     String?
  criadoEm      DateTime       @default(now())
  ativo         Boolean        @default(true)
  atualizadoEm  DateTime       @updatedAt
  alunos        Aluno[]
  coordenadores Coordenador[]

  @@map("curso")
}
```

#### 2.2 Model Aluno Atualizado
```prisma
model Aluno {
  id           String          @id @default(uuid())
  usuarioId    String          @unique
  cursoId      String
  matricula    String          @unique
  criadoEm     DateTime        @default(now())
  atualizadoEm DateTime        @updatedAt
  anoIngresso  Int?
  ativo        Boolean         @default(true)
  semestre     Int?            @default(1)
  tipoAcesso   TipoAcessoAluno  // <- Campo atualizado
  curso        Curso           @relation(fields: [cursoId], references: [id])
  usuario      Usuario         @relation("UsuarioAluno", fields: [usuarioId], references: [id], onDelete: Cascade)

  @@index([cursoId])
  @@index([tipoAcesso])
  @@map("aluno")
}
```

#### 2.3 Model Coordenador Atualizado
```prisma
model Coordenador {
  id        String  @id @default(uuid())
  usuarioId String  @unique
  cursoId   String? // <- Campo adicionado (opcional)
  area      String?
  nivel     String?
  curso     Curso?  @relation(fields: [cursoId], references: [id])
  usuario   Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@map("coordenador")
}
```

#### 2.4 Novo Enum
```prisma
enum TipoAcessoAluno {
  ACESSO_TUTOR
  ACESSO_BOLSISTA
}
```

#### 2.5 Cursos Pré-definidos Inseridos
- Sistemas de Informação
- Ciências da Computação
- Engenharia Ambiental e Sanitária
- Engenharia Civil
- Engenharia de Minas

### 3. **Novas Rotas Implementadas**

#### 3.1 Rotas de Alunos (`/api/alunos`)
- `POST /api/alunos` - Criar aluno (apenas coordenadores)
- `GET /api/alunos` - Listar todos os alunos (coordenadores e tutores)
- `GET /api/alunos/tutores` - Listar alunos tutores (coordenadores e tutores)
- `GET /api/alunos/bolsistas` - Listar alunos bolsistas (coordenadores e tutores)

#### 3.2 Rotas de Cursos (`/api/cursos`)
- `POST /api/cursos` - Criar curso (apenas coordenadores)
- `GET /api/cursos` - Listar cursos (todos os usuários autenticados)

### 4. **Correções de TypeScript**

#### 4.1 Problema com `req.user`
**Problema**: TypeScript não reconhecia a propriedade `user` no objeto `Request`

**Solução Implementada**:
```typescript
// Em vez de criar interfaces conflitantes, usamos casting
const userId = (req as any).user?.id;
```

**Arquivos Corrigidos**:
- `src/presentation/user/routes/userRoutes.ts`
- `src/presentation/certificate/routes/certificateRoutes.ts`
- `src/presentation/notification/controllers/NotificationController.ts`
- `src/presentation/middlewares/authMiddleware.ts`

## Como Criar Novos Tipos de Usuários

### Abordagem Atual do Sistema

O sistema Next-Event implementa uma arquitetura baseada em **roles (papéis)** onde um usuário base pode ter diferentes perfis específicos:

```
Usuario (base)
├── Coordenador (+ curso associado)
├── Aluno (+ curso + tipo de acesso)
│   ├── ACESSO_TUTOR
│   └── ACESSO_BOLSISTA
└── [Outros perfis podem ser adicionados]
```

### Passo a Passo para Criar um Novo Tipo de Usuário

#### 1. **Criar a Entidade de Domínio**

Exemplo para um novo tipo "Professor":

```typescript
// src/domain/professor/entities/Professor.ts
export class Professor {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly cursoId: string,
    public readonly departamento: string,
    public readonly nivel: 'GRADUACAO' | 'POS_GRADUACAO',
    public readonly ativo: boolean = true,
    public readonly criadoEm: Date = new Date(),
    public readonly atualizadoEm?: Date
  ) {}

  static create(data: {
    usuarioId: string;
    cursoId: string;
    departamento: string;
    nivel: 'GRADUACAO' | 'POS_GRADUACAO';
  }): Professor {
    return new Professor(
      crypto.randomUUID(),
      data.usuarioId,
      data.cursoId,
      data.departamento,
      data.nivel
    );
  }
}
```

#### 2. **Criar Repository Interface**

```typescript
// src/domain/professor/repositories/IProfessorRepository.ts
export interface IProfessorRepository {
  save(professor: Professor): Promise<void>;
  findById(id: string): Promise<Professor | null>;
  findByUsuarioId(usuarioId: string): Promise<Professor | null>;
  findByCursoId(cursoId: string): Promise<Professor[]>;
  findAll(): Promise<Professor[]>;
  update(professor: Professor): Promise<void>;
  delete(id: string): Promise<void>;
}
```

#### 3. **Adicionar ao Schema Prisma**

```prisma
// prisma/schema.prisma
model Professor {
  id           String                @id @default(uuid())
  usuarioId    String                @unique
  cursoId      String
  departamento String
  nivel        NivelProfessor
  ativo        Boolean               @default(true)
  criadoEm     DateTime              @default(now())
  atualizadoEm DateTime              @updatedAt
  curso        Curso                 @relation(fields: [cursoId], references: [id])
  usuario      Usuario               @relation("UsuarioProfessor", fields: [usuarioId], references: [id], onDelete: Cascade)

  @@map("professor")
}

enum NivelProfessor {
  GRADUACAO
  POS_GRADUACAO
}
```

#### 4. **Implementar Repository**

```typescript
// src/infrastructure/professor/repositories/PostgresProfessorRepository.ts
export class PostgresProfessorRepository implements IProfessorRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async save(professor: Professor): Promise<void> {
    await this.prisma.professor.create({
      data: {
        id: professor.id,
        usuarioId: professor.usuarioId,
        cursoId: professor.cursoId,
        departamento: professor.departamento,
        nivel: professor.nivel,
        ativo: professor.ativo,
        criadoEm: professor.criadoEm,
        atualizadoEm: professor.atualizadoEm
      }
    });
  }

  // ... outros métodos
}
```

#### 5. **Criar Use Cases**

```typescript
// src/application/professor/use-cases/CreateProfessorUseCase.ts
export class CreateProfessorUseCase {
  constructor(
    private professorRepository: IProfessorRepository,
    private usuarioRepository: IUsuarioRepository,
    private cursoRepository: ICursoRepository
  ) {}

  async execute(data: CreateProfessorDTO): Promise<void> {
    // Validações...
    const professor = Professor.create(data);
    await this.professorRepository.save(professor);
  }
}
```

#### 6. **Criar Controllers e Routes**

```typescript
// src/presentation/professor/controllers/ProfessorController.ts
export class ProfessorController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { usuarioId, cursoId, departamento, nivel } = req.body;
      
      await this.createProfessorUseCase.execute({
        usuarioId,
        cursoId,
        departamento,
        nivel
      });

      res.status(201).json({ message: 'Professor criado com sucesso' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

```typescript
// src/presentation/professor/routes/professorRoutes.ts
const router = Router();

router.post('/', authMiddleware, authorizeRoles(['coordinator']), (req: Request, res: Response) => 
  professorController.create(req, res)
);

router.get('/', authMiddleware, (req: Request, res: Response) => 
  professorController.list(req, res)
);

export default router;
```

#### 7. **Registrar as Rotas**

```typescript
// src/main.ts
import professorRoutes from './presentation/professor/routes/professorRoutes';

app.use('/api/professores', professorRoutes);
```

#### 8. **Gerar e Aplicar Migração**

```bash
# Gerar migração
npx prisma migrate dev --name "add-professor-model"

# Regenerar Prisma Client
npx prisma generate
```

### Exemplo de Uso das Novas APIs

#### Criar um Aluno Tutor
```bash
POST /api/alunos
Content-Type: application/json
Authorization: Bearer <token_coordenador>

{
  "usuarioId": "uuid-do-usuario",
  "cursoId": "uuid-do-curso",
  "matricula": "2024001",
  "tipoAcesso": "ACESSO_TUTOR",
  "anoIngresso": 2024,
  "semestre": 1
}
```

#### Criar um Aluno Bolsista
```bash
POST /api/alunos
Content-Type: application/json
Authorization: Bearer <token_coordenador>

{
  "usuarioId": "uuid-do-usuario",
  "cursoId": "uuid-do-curso",
  "matricula": "2024002",
  "tipoAcesso": "ACESSO_BOLSISTA",
  "anoIngresso": 2024,
  "semestre": 1
}
```

#### Listar Cursos Disponíveis
```bash
GET /api/cursos
Authorization: Bearer <token_qualquer_usuario>
```

### Considerações Importantes

1. **Relacionamentos**: Todos os tipos de usuários específicos devem ter relacionamento com `Usuario` e `Curso`

2. **Autorização**: Use os middlewares `authMiddleware` e `authorizeRoles` para controlar acesso

3. **Validação**: Sempre valide se o usuário e curso existem antes de criar perfis específicos

4. **Migrações**: Sempre gere migrações quando modificar o schema

5. **Testes**: Crie testes unitários para os novos use cases e controllers

6. **TypeScript**: Use interfaces tipadas e DTOs para melhor experiência de desenvolvimento

### Estrutura de Arquivos Recomendada

```
src/
├── domain/
│   └── [tipo-usuario]/
│       ├── entities/
│       ├── repositories/
│       └── dtos/
├── application/
│   └── [tipo-usuario]/
│       ├── use-cases/
│       └── dtos/
├── infrastructure/
│   └── [tipo-usuario]/
│       └── repositories/
└── presentation/
    └── [tipo-usuario]/
        ├── controllers/
        └── routes/
```

Esta estrutura garante consistência, manutenibilidade e escalabilidade do sistema.