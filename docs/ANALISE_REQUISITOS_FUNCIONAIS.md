# Análise de Atendimento aos Requisitos Funcionais

## Resumo Executivo

O sistema atual **atende parcialmente** aos requisitos funcionais solicitados. A base estrutural está implementada, mas faltam funcionalidades específicas e algumas integrações entre módulos.

## Análise Detalhada por Requisito

### ✅ **RF05: Upload de certificados do Aluno autenticado**

**STATUS: IMPLEMENTADO**

- ✅ Rota `/api/certificates/upload` implementada
- ✅ Middleware de autenticação configurado
- ✅ Upload com multer configurado
- ✅ Integração com storage service
- ✅ Processamento de PDF implementado

**Localização:**

- Controller: `src/presentation/certificate/controllers/certificateController.ts`
- Routes: `src/presentation/certificate/routes/certificateRoutes.ts`
- Use Case: `src/application/certificate/use-cases/UploadCertificateUseCase.ts`

---

### ✅ **RF07: Leitura dos dados presentes no certificado**

**STATUS: IMPLEMENTADO**

- ✅ Interface `IPDFProcessor` para leitura de PDF
- ✅ Extração automática de dados (nome, evento, carga horária, data)
- ✅ Integração com upload de certificados

**Localização:**

- Interface: `src/domain/certificate/services/IPDFProcessor.ts`
- Implementação: `src/infrastructure/certificate/services/PDFProcessor.ts`

---

### ✅ **RF09: Restrição de acesso aos certificados por perfil**

**STATUS: IMPLEMENTADO**

- ✅ Middleware de autorização por roles
- ✅ Filtros por usuário autenticado
- ✅ Validação de permissões no controller

**Localização:**

- Middleware: `src/presentation/middlewares/authorizeRoles.ts`
- Controller: Método `listUserCertificates` em `certificateController.ts`

---

### ❌ **RF10: Tutor visualizar registros de seus alunos**

**STATUS: NÃO IMPLEMENTADO**

- ❌ Falta endpoint específico para tutor visualizar seus alunos
- ❌ Falta relacionamento tutor-aluno no banco de dados
- ❌ Falta use case para listar alunos por tutor

**O que precisa ser implementado:**

1. Endpoint `GET /api/tutores/alunos`
2. Use case `ListAlunosByTutorUseCase`
3. Relacionamento na tabela `AlocarTutorAluno`

---

### ❌ **RF11: Formulário de acompanhamento do Tutor**

**STATUS: PARCIALMENTE IMPLEMENTADO**

- ✅ Entidade `FormAcompanhamento` existe no banco
- ❌ Falta endpoint para criação
- ❌ Falta controller e use cases específicos
- ❌ Falta validações de campos obrigatórios

**O que existe:**

- Modelo: `FormAcompanhamento` no schema Prisma
- Campos: tutorId, bolsistaId, periodoId, conteudo (JSON)

**O que precisa ser implementado:**

1. Controller `FormAcompanhamentoController`
2. Use case `CreateFormAcompanhamentoUseCase`
3. Validações de campos (modalidade, dificuldades, etc.)
4. Endpoint `POST /api/form-acompanhamento`

---

### ❌ **RF13: Bolsista visualizar registros de Alunos e Tutores**

**STATUS: NÃO IMPLEMENTADO**

- ❌ Falta endpoint específico para bolsistas
- ❌ Falta permissões adequadas
- ❌ Falta formatação em tabela

**O que precisa ser implementado:**

1. Endpoint `GET /api/bolsistas/alunos`
2. Endpoint `GET /api/bolsistas/tutores`
3. Autorização para role `bolsista`

---

### ❌ **RF14: Bolsista gerar relatórios consolidados**

**STATUS: PARCIALMENTE IMPLEMENTADO**

- ✅ Base de relatórios existe
- ❌ Falta relatórios consolidados específicos
- ❌ Falta use cases para geração automática

**O que existe:**

- Entidades de relatório no banco
- Sistema básico de relatórios

**O que precisa ser implementado:**

1. Use case `GenerateConsolidatedReportUseCase`
2. Templates de relatórios consolidados
3. Endpoint `POST /api/relatorios/consolidado`

---

### ✅ **RF15: Carga horária mínima por atividade**

**STATUS: IMPLEMENTADO**

- ✅ Entidade `CargaHorariaMinima` implementada
- ✅ Categorias de workload (EVENTOS, MONITORIA, ESTUDOS_INDIVIDUAIS)
- ✅ Relacionamento com períodos de tutoria

**Localização:**

- Modelo: `CargaHorariaMinima` no schema Prisma
- Controller: `src/presentation/cargaHorariaMinima/`

---

### ✅ **RF16: Alocar Alunos a Tutores**

**STATUS: IMPLEMENTADO**

- ✅ Entidade `AlocarTutorAluno` implementada
- ✅ Controle de períodos de tutoria
- ✅ Validação de capacidade máxima do tutor

**Localização:**

- Modelo: `AlocarTutorAluno` e `PeriodoTutoria` no schema
- Controller: `src/presentation/alocarTutorAluno/`

---

### ✅ **RF19: Validação manual de certificados**

**STATUS: IMPLEMENTADO**

- ✅ Status de certificado (PENDENTE, APROVADO, REJEITADO)
- ✅ Comentários do administrador
- ✅ Use case de atualização de status

**Localização:**

- Use Case: `UpdateCertificateStatusUseCase`
- Controller: Método `updateStatus` em `certificateController.ts`

---

### ❌ **Formulários de Avaliação do Projeto de Tutoria**

**STATUS: NÃO IMPLEMENTADO**

- ❌ Falta entidade específica para avaliação de projeto
- ❌ Falta campos para experiência e dificuldades
- ❌ Falta diferenciação entre formulários

**O que precisa ser implementado:**

1. Entidade `AvaliacaoProjetoTutoria`
2. Campos específicos para experiência e dificuldades
3. Controller e use cases dedicados
4. Endpoint `POST /api/avaliacao-projeto`

---

## Priorização de Desenvolvimento

### Alta Prioridade (Funcionalidades Críticas Faltando)

1. **RF10**: Implementar visualização de alunos por tutor
2. **RF11**: Completar formulário de acompanhamento
3. **Formulário de Avaliação**: Nova funcionalidade crítica

### Média Prioridade

4. **RF13**: Visualização de registros para bolsistas
5. **RF14**: Relatórios consolidados

### Funcionalidades Já Funcionais ✅

- RF05: Upload de certificados
- RF07: Leitura de dados do certificado
- RF09: Controle de acesso por perfil
- RF15: Carga horária mínima
- RF16: Alocação tutor-aluno
- RF19: Validação de certificados

---

## Recomendações

### 1. Implementações Urgentes

- Criar endpoint para tutores visualizarem seus alunos
- Finalizar funcionalidade de formulário de acompanhamento
- Implementar formulário de avaliação do projeto de tutoria

### 2. Melhorias na Arquitetura

- Adicionar relacionamento direto tutor-aluno no banco
- Implementar cache para consultas frequentes
- Melhorar validações de entrada

### 3. Funcionalidades Complementares

- Dashboard para visualização de dados
- Notificações automáticas
- Exportação de relatórios em PDF/Excel

---

## Conclusão

O sistema possui uma **base sólida** com aproximadamente **70% dos requisitos funcionais atendidos**. As principais lacunas estão em:

1. **Relacionamentos específicos**: Tutor → Alunos
2. **Formulários completos**: Acompanhamento e Avaliação
3. **Relatórios avançados**: Consolidação de dados
4. **Permissões específicas**: Visualizações por role

**Estimativa de desenvolvimento restante**: 2-3 semanas para completar todas as funcionalidades faltantes.
