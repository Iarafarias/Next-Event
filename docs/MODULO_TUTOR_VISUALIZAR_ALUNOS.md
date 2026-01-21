# Módulo Tutor - Visualização de Alunos

## Funcionalidades Implementadas

### ✅ RF10: Tutor visualizar registros de seus respectivos Alunos

O sistema agora permite que tutores autenticados visualizem em formato de tabela os registros de seus respectivos alunos.

## Endpoints Implementados

### 1. **GET /api/tutores/meus-alunos**
**Descrição**: Permite que um tutor autenticado visualize seus próprios alunos.

**Autorização**: Apenas usuários com role `tutor`

**Headers**:
```
Authorization: Bearer {token}
```

**Resposta de Sucesso (200)**:
```json
{
  "message": "Alunos do tutor listados com sucesso",
  "data": [
    {
      "id": "uuid",
      "usuarioId": "uuid", 
      "cursoId": "uuid",
      "matricula": "202301234",
      "tipoAcesso": "ACESSO_TUTOR",
      "anoIngresso": 2023,
      "semestre": 1,
      "ativo": true,
      "criadoEm": "2024-01-20T10:00:00Z",
      "atualizadoEm": "2024-01-20T10:00:00Z"
    }
  ],
  "total": 1
}
```

**Erros**:
- `404`: Tutor não encontrado
- `401`: Token não fornecido ou inválido
- `403`: Acesso negado - apenas tutores

### 2. **GET /api/tutores/{id}/alunos**
**Descrição**: Permite que coordenadores visualizem alunos de um tutor específico.

**Autorização**: Apenas usuários com role `coordinator`

**Parâmetros**:
- `id` (path): ID do usuário tutor

**Headers**:
```
Authorization: Bearer {token}
```

**Resposta**: Mesma estrutura do endpoint anterior.

**Erros**:
- `404`: Tutor não encontrado
- `401`: Token não fornecido ou inválido
- `403`: Acesso negado - apenas coordenadores

## Arquitetura Implementada

### Domain Layer
- **ITutorRepository**: Interface para operações relacionadas a tutores
  - `findTutorByUsuarioId()`: Busca tutor pelo ID do usuário
  - `findAlunosByTutorId()`: Busca alunos alocados para um tutor

### Application Layer  
- **ListAlunosByTutorUseCase**: Caso de uso para listar alunos de um tutor
  - Validação de existência do tutor
  - Busca de alunos através da tabela de alocação
  - Logging de operações

### Infrastructure Layer
- **PostgresTutorRepository**: Implementação do repository usando Prisma
  - Consulta a tabela `AlocarTutorAluno` para relacionamento
  - Inclui dados do usuário, aluno e curso
  - Filtra apenas alocações ativas

### Presentation Layer
- **TutorController**: Controller para gerenciar operações de tutor
  - `listMyAlunos()`: Para tutores visualizarem seus alunos
  - `listAlunos()`: Para coordenadores visualizarem alunos de tutores específicos
- **tutorRoutes**: Definição das rotas com middleware de autorização

## Relacionamentos no Banco de Dados

O sistema utiliza a tabela **AlocarTutorAluno** existente para estabelecer o relacionamento entre tutores e alunos:

```sql
-- Estrutura da consulta realizada
SELECT a.* 
FROM AlocarTutorAluno ata
JOIN Bolsista b ON ata.bolsistaId = b.id
JOIN Usuario u ON b.usuarioId = u.id  
JOIN Aluno a ON u.id = a.usuarioId
WHERE ata.tutorId = ? AND ata.ativo = true
```

## Como Testar

### 1. Pré-requisitos
- Usuário com role `tutor` criado e autenticado
- Alunos alocados para este tutor na tabela `AlocarTutorAluno`
- Token JWT válido

### 2. Teste no Swagger
1. Acesse `http://localhost:3000/api-docs`
2. Autentique com um usuário tutor
3. Execute `GET /tutores/meus-alunos`

### 3. Teste via cURL
```bash
curl -X GET \
  'http://localhost:3000/api/tutores/meus-alunos' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

## Logs e Monitoramento

O sistema registra as seguintes operações:
- Tentativas de acesso aos endpoints
- Busca por tutores
- Quantidade de alunos encontrados
- Erros durante as operações

**Exemplo de log**:
```
[INFO] GET /tutores/meus-alunos - Listar alunos do tutor {"tutorUsuarioId":"uuid"}
[INFO] Alunos encontrados para tutor {"tutorId":"uuid","quantidadeAlunos":3}
```

## Tratamento de Erros

### Tutor não encontrado
Se o usuário autenticado não possuir perfil de tutor na tabela `Tutor`, retorna erro 404.

### Sem alunos alocados  
Se o tutor não possuir alunos alocados, retorna array vazio com total 0.

### Problemas de banco
Erros de conexão ou consulta retornam erro 500 com log detalhado.

## Próximos Passos

Esta implementação atende ao **RF10**. Para completar o sistema de tutoria, os próximos passos seriam:

1. **RF11**: Implementar formulário de acompanhamento
2. Adicionar paginação para listas grandes de alunos
3. Implementar filtros (curso, período, status)
4. Adicionar cache para consultas frequentes
5. Criar dashboard visual para tutores

## Segurança

- ✅ Autenticação obrigatória via JWT
- ✅ Autorização por roles (tutor/coordenador)
- ✅ Tutores só veem seus próprios alunos
- ✅ Coordenadores podem ver alunos de qualquer tutor
- ✅ Logs de auditoria para todas as operações