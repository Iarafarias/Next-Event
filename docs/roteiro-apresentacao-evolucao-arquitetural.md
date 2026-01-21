# Roteiro de Apresentação: Evolução Arquitetural Next-Event

## Seminário - Arquitetura de Software

---

## 1. Introdução (3-5 min)

### Contexto do Projeto

- **Sistema:** Next-Event - Plataforma de gestão de tutoria e certificados
- **Arquitetura atual:** Monólito Node.js/Express + PostgreSQL
- **Objetivo:** Propor evolução para microsserviços

### Agenda da Apresentação

1. Arquitetura atual (estado AS-IS)
2. Bounded contexts identificados
3. Arquitetura proposta (estado TO-BE)
4. Benefícios e desafios
5. Estratégia de migração
6. SOA vs Microsserviços

---

## 2. Arquitetura Atual - Monólito (5-7 min)

### Visão Geral

- **Frontend:** React/Next.js
- **Backend:** Node.js/Express com arquitetura em camadas
- **Banco:** PostgreSQL único
- **Armazenamento:** Sistema de arquivos local

### Estrutura do Código

```
src/
├── domain/          # Regras de negócio
├── application/     # Casos de uso
├── infrastructure/  # Acesso a dados
└── presentation/    # Controllers/Rotas
```

### Domínios Identificados

- User (usuários e autenticação)
- Tutoria (períodos, alocações, acompanhamento)
- Certificate (emissão e validação)
- Notification (notificações)
- Reporting (relatórios diversos)
- Event (gestão de eventos)

### Problemas Atuais

- **Acoplamento:** Mudanças impactam todo o sistema
- **Escalabilidade:** Não é possível escalar componentes isoladamente
- **Deploy:** Tudo ou nada - risco alto
- **Tecnologia:** Stack única limita escolhas

---

## 3. Bounded Contexts (8-10 min)

### Domain-Driven Design (DDD)

> "Um bounded context é uma fronteira conceitual onde um modelo de domínio é aplicado" - Eric Evans

### Contextos Identificados

#### 🧑‍💼 User Context

- **Responsabilidade:** Autenticação, autorização, perfis
- **Entidades:** User, Profile, Role
- **Diretórios:** `src/domain/user`, `src/application/user`

#### 📚 Tutoria Context

- **Responsabilidade:** Gestão completa de tutorias
- **Entidades:** PeriodoTutoria, AlocacaoTutorAluno, CargaHoraria, FormAcompanhamento
- **Diretórios:** `src/domain/periodoTutoria`, `src/domain/alocarTutorAluno`

#### 🏆 Certificate Context

- **Responsabilidade:** Emissão e validação de certificados
- **Entidades:** Certificate, Template, Validation
- **Diretórios:** `src/domain/certificate`

#### 📧 Notification Context

- **Responsabilidade:** Envio de notificações
- **Entidades:** Notification, Channel, Template
- **Diretórios:** `src/domain/notification`

#### 📊 Reporting Context

- **Responsabilidade:** Relatórios e analytics
- **Entidades:** Report, Metrics, Dashboard
- **Diretórios:** `src/domain/relatorio*`

### Critérios de Separação

- **Coesão funcional:** Funcionalidades relacionadas juntas
- **Autonomia de dados:** Cada contexto gerencia seus dados
- **Equipes independentes:** Diferentes times podem trabalhar isoladamente
- **Ciclos de vida distintos:** Evolução independente

---

## 4. Arquitetura Proposta - Microsserviços (10-12 min)

### Visão da Nova Arquitetura

```
Web App → API Gateway → [User, Tutoria, Certificate, Notification, Reporting] Services
                     ↓
              Message Bus (Events)
                     ↓
        [UserDB, TutoriaDB, CertDB, NotifDB, ReportDB]
```

### Componentes Principais

#### API Gateway

- **Função:** Ponto único de entrada, roteamento, autenticação
- **Tecnologia:** Kong, AWS API Gateway, Zuul
- **Responsabilidades:**
  - Rate limiting
  - JWT validation
  - Request/Response transformation
  - Load balancing

#### Microsserviços

- **User Service:** Autenticação e gestão de usuários
- **Tutoria Service:** Lógica de negócio de tutoria
- **Certificate Service:** Emissão e validação de certificados
- **Notification Service:** Envio de notificações
- **Reporting Service:** Geração de relatórios

#### Message Bus

- **Tecnologia:** RabbitMQ, Apache Kafka, AWS SQS
- **Padrão:** Event-driven architecture
- **Eventos:** `UserRegistered`, `TutoringCompleted`, `CertificateIssued`

### Database per Service

- Cada serviço tem seu próprio banco
- Transações locais por serviço
- Integração via eventos assíncronos
- Eventual consistency

---

## 5. Benefícios e Desafios (8-10 min)

### ✅ Benefícios

#### Escalabilidade

- Escala horizontal independente por serviço
- Recursos dedicados onde necessário
- Performance otimizada por contexto

#### Autonomia de Desenvolvimento

- Times independentes por serviço
- Tecnologias diferentes por necessidade
- Deploy independente e frequente

#### Resiliência

- Falha isolada por serviço
- Circuit breakers e timeouts
- Degradação graceful

#### Manutenibilidade

- Codebase menor por serviço
- Menor complexidade cognitiva
- Testes mais focados

### ⚠️ Desafios

#### Complexidade Operacional

- Múltiplos deployments
- Monitoramento distribuído
- Debugging complexo

#### Consistência de Dados

- Eventual consistency
- Transações distribuídas complexas
- Padrões como Saga pattern

#### Comunicação

- Latência de rede
- Tratamento de falhas
- Versionamento de APIs

#### Overhead Inicial

- Infraestrutura mais complexa
- Ferramentas de observabilidade
- Curva de aprendizado

---

## 6. Estratégia de Migração (7-9 min)

### Abordagem: Strangler Fig Pattern

#### Fase 1: Preparação (2-3 meses)

- Refatoração interna do monólito
- Separação clara de contextos
- Implementação de eventos internos
- Setup de infraestrutura (CI/CD, monitoring)

#### Fase 2: Extração Gradual (6-8 meses)

1. **Notification Service** (baixo acoplamento)
2. **Certificate Service** (isolado funcionalmente)
3. **User Service** (core, mas bem definido)
4. **Reporting Service** (read-only, menos crítico)
5. **Tutoria Service** (core business, por último)

#### Fase 3: Otimização (2-3 meses)

- Performance tuning
- Monitoramento avançado
- Automação completa
- Documentação final

### Padrões de Migração

#### Database Migration

```sql
-- Exemplo: Separação gradual de tabelas
-- Fase 1: Replicação
-- Fase 2: Dual writes
-- Fase 3: Migração completa
-- Fase 4: Cleanup
```

#### API Contract Evolution

- Versionamento semântico
- Backward compatibility
- Deprecation timeline
- Consumer notification

---

## 7. SOA vs Microsserviços (5-7 min)

### Comparação Técnica

| Aspecto           | SOA                 | Microsserviços       |
| ----------------- | ------------------- | -------------------- |
| **Granularidade** | Serviços grandes    | Serviços pequenos    |
| **Integração**    | ESB/Mediadores      | HTTP/Message queues  |
| **Dados**         | Banco compartilhado | Database per service |
| **Governança**    | Centralizada        | Descentralizada      |
| **Deploy**        | Monolítico          | Independente         |
| **Tecnologia**    | Padronizada         | Poliglota            |

### Quando Usar Cada Um

#### SOA é melhor quando:

- Integração de sistemas legados
- Governança forte necessária
- Equipe centralizada
- Processos de negócio complexos e longos

#### Microsserviços são melhores quando:

- Equipes autônomas
- Deploy frequente
- Escalabilidade diferenciada
- Inovação tecnológica rápida

---

## 8. Conclusões e Próximos Passos (3-5 min)

### Resumo da Proposta

- **Situação atual:** Monólito funcional mas limitado
- **Proposta:** Evolução gradual para microsserviços
- **Benefícios principais:** Escalabilidade, autonomia, resiliência
- **Estratégia:** Strangler fig pattern em 3 fases

### Próximos Passos

1. **Aprovação:** Validação da proposta com stakeholders
2. **POC:** Proof of concept com Notification Service
3. **Roadmap:** Planejamento detalhado das fases
4. **Capacitação:** Treinamento da equipe em microsserviços
5. **Infraestrutura:** Setup de ferramentas e monitoramento

### Métricas de Sucesso

- **Deploy frequency:** De semanal para diário
- **Lead time:** Redução de 50% no time to market
- **MTTR:** Recovery em minutos, não horas
- **Availability:** 99.9% uptime por serviço

---

## 9. Q&A (5-10 min)

### Perguntas Esperadas

**"Como garantir consistência sem transações distribuídas?"**

- Eventual consistency por design
- Compensating actions (Saga pattern)
- Idempotência em todos os pontos

**"O overhead não supera os benefícios?"**

- Depende da escala e complexidade
- ROI positivo com múltiplas equipes
- Automação reduz overhead operacional

**"Como migrar dados sem downtime?"**

- Blue-green deployments
- Dual writes durante transição
- Rollback strategy sempre definida

---

## Referências e Recursos

### Documentação do Projeto

- [Container Diagram](./container-diagram.md)
- [Microservices Architecture](./microservices-architecture.md)
- [Código fonte](../src/)

### Literatura Recomendada

- "Building Microservices" - Sam Newman
- "Microservices Patterns" - Chris Richardson
- "Domain-Driven Design" - Eric Evans

### Ferramentas Mencionadas

- **API Gateway:** Kong, AWS API Gateway
- **Message Bus:** RabbitMQ, Apache Kafka
- **Observability:** Prometheus, Grafana, Jaeger
- **Container:** Docker, Kubernetes

---

**Tempo estimado total:** 45-60 minutos + Q&A
