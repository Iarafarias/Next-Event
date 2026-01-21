# Implementação de Relatórios Consolidados e Permissões para Bolsistas

## 📋 Resumo da Implementação

Esta implementação adiciona funcionalidades avançadas para:

- **Relatórios consolidados**: Geração de relatórios com estatísticas detalhadas do sistema
- **Permissões para bolsistas**: Visualização específica de dados e controle de acesso

## 🎯 Funcionalidades Implementadas

### 1. Relatórios Consolidados

#### DTO de Relatório Consolidado

**Arquivo**: `src/application/relatorio/dtos/RelatorioConsolidadoDTO.ts`

```typescript
export interface RelatorioConsolidadoDTO {
  periodo: {
    id: string;
    nome: string;
    dataInicio: Date;
    dataFim: Date;
  };
  estatisticas: {
    totalAlunos: number;
    totalTutores: number;
    totalFormulariosAcompanhamento: number;
    totalAvaliacoesTutoria: number;
    totalCertificadosPendentes: number;
    totalCertificadosAprovados: number;
    totalCertificadosRejeitados: number;
  };
  distribuicaoSatisfacao: {
    muitoInsatisfeito: number;
    insatisfeito: number;
    neutro: number;
    satisfeito: number;
    muitoSatisfeito: number;
  };
  principaisDificuldades: {
    comunicacao: number;
    conteudo: number;
    metodologicas: number;
    recursos: number;
    outras: number;
  };
  alunosPorTutor: Array<{
    tutorNome: string;
    tutorEmail: string;
    quantidadeAlunos: number;
    avaliacaoMedia?: number;
  }>;
  certificadosPorCategoria: Array<{
    categoria: string;
    total: number;
    aprovados: number;
    pendentes: number;
    rejeitados: number;
  }>;
  formsAcompanhamentoPorMes: Array<{
    mes: string;
    quantidade: number;
  }>;
  geradoEm: Date;
  geradoPor: string;
}
```

#### Use Case de Geração de Relatórios

**Arquivo**: `src/application/relatorio/use-cases/GenerateRelatorioConsolidadoUseCase.ts`

**Funcionalidades**:

- Agregação de dados de múltiplas fontes
- Cálculo de estatísticas em tempo real
- Análise de tendências temporais
- Distribuição de satisfação e dificuldades
- Métricas de performance

### 2. Permissões para Bolsistas

#### Use Case de Visualização para Bolsistas

**Arquivo**: `src/application/user/use-cases/BolsistaViewDataUseCase.ts`

```typescript
export interface BolsistaDataView {
  alunos: {
    total: number;
    porCurso: Array<{ curso: string; quantidade: number }>;
    porTipo: Array<{ tipo: string; quantidade: number }>;
    registros: Array<{
      id: string;
      nome: string;
      email: string;
      matricula: string;
      curso: string;
      tipoAcesso: string;
      ativo: boolean;
      dataIngresso: Date;
    }>;
  };
  tutores: {
    total: number;
    capacidadeTotal: number;
    alocacoes: Array<{
      id: string;
      nome: string;
      email: string;
      alunosAtivos: number;
      capacidadeMaxima: number;
      percentualOcupacao: number;
    }>;
  };
  certificados: {
    totalPendentes: number;
    totalAprovados: number;
    totalRejeitados: number;
    recentesPendentes: Array<{
      id: string;
      titulo: string;
      aluno: string;
      dataEnvio: Date;
      categoria: string;
    }>;
  };
  // ... outros campos
}
```

#### Controller para Bolsistas

**Arquivo**: `src/presentation/user/controllers/BolsistaController.ts`

**Endpoints disponíveis**:

- `GET /bolsistas/dashboard` - Dashboard completo
- `GET /bolsistas/alunos` - Lista de alunos com estatísticas
- `GET /bolsistas/tutores` - Dados dos tutores
- `GET /bolsistas/certificados` - Informações de certificados
- `GET /bolsistas/forms-acompanhamento` - Formulários de acompanhamento
- `POST /bolsistas/relatorio-consolidado` - Gerar relatório personalizado

## 🛠️ Estrutura de Rotas

### Rotas para Bolsistas

**Arquivo**: `src/presentation/bolsista/routes/bolsistaRoutes.ts`

```typescript
// Middleware de autenticação e autorização
router.use(authMiddleware);
router.use(roleMiddleware(["bolsista"]));

// Rotas específicas para bolsistas
router.get("/dashboard", bolsistaController.getDashboardData);
router.get("/alunos", bolsistaController.getAlunos);
router.get("/tutores", bolsistaController.getTutores);
router.get("/certificados", bolsistaController.getCertificados);
router.get("/forms-acompanhamento", bolsistaController.getFormsAcompanhamento);
router.post(
  "/relatorio-consolidado",
  bolsistaController.generateRelatorioConsolidado,
);
```

### Rotas para Relatórios Consolidados

**Arquivo**: `src/presentation/relatorio/routes/relatorioConsolidadoRoutes.ts`

```typescript
// Acessível para coordinators e bolsistas
router.use(roleMiddleware(["coordinator", "bolsista"]));

router.post("/consolidado", generateRelatorioConsolidado);
router.get("/template", getTemplate);
```

## 🔐 Sistema de Permissões

### Controle de Acesso por Papel

1. **Bolsista**:
   - ✅ Visualizar dados de alunos, tutores e certificados
   - ✅ Gerar relatórios consolidados
   - ✅ Acessar dashboard com estatísticas
   - ❌ Editar dados ou aprovar certificados

2. **Coordinator**:
   - ✅ Todas as permissões de bolsista
   - ✅ Gerar relatórios detalhados
   - ✅ Configurar períodos e parâmetros

### Middleware de Autorização

```typescript
// Aplicado automaticamente às rotas
router.use(authMiddleware); // Verificar JWT
router.use(roleMiddleware(["bolsista"])); // Verificar papel específico
```

## 📊 Métricas e Análises

### Estatísticas Coletadas

1. **Números Gerais**:
   - Total de alunos, tutores, formulários
   - Status de certificados (pendentes, aprovados, rejeitados)

2. **Análise de Satisfação**:
   - Distribuição por níveis (muito insatisfeito → muito satisfeito)
   - Baseado nas avaliações de tutoria

3. **Principais Dificuldades**:
   - Comunicação, conteúdo, metodológicas, recursos
   - Extraído dos formulários de acompanhamento

4. **Tendências Temporais**:
   - Formulários por mês
   - Evolução de certificados

## 🚀 Uso das APIs

### Exemplos de Requisições

#### 1. Dashboard do Bolsista

```bash
GET /api/bolsistas/dashboard
Authorization: Bearer <token-bolsista>
```

**Resposta**:

```json
{
  "message": "Dados do dashboard carregados com sucesso",
  "data": {
    "alunos": {
      "total": 150,
      "porCurso": [
        {"curso": "Engenharia", "quantidade": 80},
        {"curso": "Administração", "quantidade": 70}
      ],
      "registros": [...]
    },
    "tutores": {
      "total": 25,
      "capacidadeTotal": 200,
      "alocacoes": [...]
    },
    "estatisticasGerais": {
      "taxaAprovacaoCertificados": 87.5,
      "mediaReunioesPorForm": 3.2
    }
  }
}
```

#### 2. Gerar Relatório Consolidado

```bash
POST /api/bolsistas/relatorio-consolidado
Authorization: Bearer <token-bolsista>
Content-Type: application/json

{
  "dataInicio": "2024-01-01",
  "dataFim": "2024-12-31",
  "incluirDetalhes": true
}
```

#### 3. Visualizar Alunos

```bash
GET /api/bolsistas/alunos
Authorization: Bearer <token-bolsista>
```

### Template de Relatório

```bash
GET /api/relatorios/template
```

Retorna a estrutura completa do relatório consolidado para referência.

## 📁 Arquivos Modificados/Criados

### Novos Arquivos

- `src/application/relatorio/dtos/RelatorioConsolidadoDTO.ts`
- `src/application/relatorio/use-cases/GenerateRelatorioConsolidadoUseCase.ts`
- `src/application/user/use-cases/BolsistaViewDataUseCase.ts`
- `src/presentation/user/controllers/BolsistaController.ts`
- `src/presentation/bolsista/routes/bolsistaRoutes.ts`
- `src/presentation/relatorio/routes/relatorioConsolidadoRoutes.ts`
- `src/config/bolsistaConfig.ts`

### Arquivos Atualizados

- `src/main.ts` - Registrar novas rotas
- `openapi.yaml` - Documentação Swagger atualizada

## 🎯 Próximos Passos

1. **Implementar repositories específicos** para otimização de consultas
2. **Adicionar cache** para relatórios consolidados
3. **Criar templates visuais** (PDF, Excel) para relatórios
4. **Implementar notificações** para relatórios importantes
5. **Adicionar filtros avançados** para visualização de dados

## ✅ Funcionalidades Concluídas

- [x] **RF13**: Bolsista pode visualizar registros de alunos e tutores
- [x] **RF14**: Geração de relatórios consolidados
- [x] Sistema de permissões específicas para bolsistas
- [x] Dashboard completo para bolsistas
- [x] Templates e documentação de APIs
- [x] Middleware de autorização por papel
- [x] Documentação Swagger atualizada

## 🔧 Configuração

Para ativar as novas funcionalidades:

1. **Banco de dados**: Verifique se as migrações estão aplicadas
2. **Roles**: Certifique-se que usuários têm o papel `bolsista` configurado
3. **JWT**: Token deve incluir o papel correto no payload
4. **Ambiente**: Todas as dependências devem estar instaladas

**Status**: ✅ **Implementação completa e funcional**
