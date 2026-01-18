# 📖 API Reference - NextCertify

Esta é a documentação técnica completa de todos os endpoints disponíveis na API do NextCertify.

---

## 🔑 Autenticação e Usuários
**Base Path**: `/api/users`

| Método | Endpoint | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Pública | Cadastro de novo usuário (vínculo automático com Aluno) |
| `POST` | `/login` | Pública | Realizar login (Retorna Token, Role e Perfil Aluno) |
| `GET` | `/` | `coordinator` | Listar todos os usuários do sistema |
| `GET` | `/:id` | Autenticado | Buscar dados de um usuário específico |
| `PUT` | `/:id` | Autenticado | Atualizar dados básicos do usuário |
| `DELETE` | `/:id` | `coordinator` | Remover usuário do sistema |
| `PATCH` | `/:id/atribuir-papel` | `coordinator` | Promover/Rebaixar papéis (tutor, bolsista, etc) |
| `GET` | `/coordenadores` | `coordinator` | Listar apenas coordenadores |
| `GET` | `/tutores` | `coordinator` | Listar apenas tutores |
| `GET` | `/bolsistas` | `coord/tutor` | Listar apenas bolsistas |

---

## 🏫 Gestão de Cursos
**Base Path**: `/api/cursos`

| Método | Endpoint | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Pública | Listar todos os cursos cadastrados |
| `GET` | `/:id` | Pública | Buscar detalhes de um curso |
| `POST` | `/` | `coord/scholar` | Criar novo curso |
| `PUT` | `/:id` | `coord/scholar` | Atualizar dados do curso |
| `DELETE` | `/:id` | `coordinator` | Deletar curso (bloqueado se houver alunos) |

---

## 👨‍🎓 Gestão de Alunos
**Base Path**: `/api/alunos`

| Método | Endpoint | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | `coord/tutor/scholar`| Listar alunos com filtros (cursoId, role) |
| `GET` | `/:id` | Autenticado | Buscar perfil acadêmico do aluno |
| `PUT` | `/:id` | `coord/scholar` | Atualizar matrícula ou vínculo de curso |

---

## 📄 Certificados
**Base Path**: `/api/certificates`

| Método | Endpoint | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/upload` | `student` | Enviar arquivo PDF do certificado |
| `GET` | `/user/:userId` | Autenticado | Listar certificados de um usuário |
| `GET` | `/:id/download` | Autenticado | Baixar arquivo PDF do certificado |
| `DELETE`| `/:id` | Autenticado | Remover certificado |
| `PATCH` | `/:id/status` | `admin` | Validar (aprovar/rejeitar) certificado |
| `GET` | `/report` | `student` | Gerar relatório de horas próprio |
| `GET` | `/report/:userId` | `admin` | Gerar relatório de horas para um usuário |
| `POST` | `/reference-month` | `admin` | Definir mês de referência para tutoria |
| `POST` | `/coordenadores/:id/validar-certificado` | `coord/admin` | Fluxo de validação por coordenador |

---

## 🔔 Notificações
**Base Path**: `/api/notifications`

| Método | Endpoint | Proteção | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Autenticado | Listar minhas notificações |
| `GET` | `/unread-count` | Autenticado | Contar notificações não lidas |
| `PATCH`| `/:id/read` | Autenticado | Marcar uma notificação como lida |
| `PATCH`| `/mark-all-read` | Autenticado | Marcar todas como lidas |

---

## 📊 Relatórios Avançados
**Base Paths**: `/api/relatorios`, `/api/relatorio-*`

O sistema possui diversos módulos de relatórios específicos para acompanhamento, avaliação e desempenho:

| Base Path | Módulo | Descrição |
| :--- | :--- | :--- |
| `/api/relatorios` | Geral | Gestão de metadados de relatórios |
| `/api/relatorio-aluno` | Aluno | Desempenho individual e acadêmico |
| `/api/relatorio-tutor` | Tutor | Acompanhamento de tutores e seus grupos |
| `/api/relatorio-certificado` | Certificados | Estatísticas de emissão e validação |
| `/api/relatorio-acompanhamento`| Acompanhamento | Feedback de bolsistas e tutores |

---

## 🛠️ Gestão Acadêmica e Tutoria

| Base Path | Módulo | Descrição |
| :--- | :--- | :--- |
| `/api/periodo-tutoria` | Períodos | Gestão de semestres/ciclos de tutoria |
| `/api/alocar-tutor-aluno` | Alocação | Vínculo entre tutores e seus alunos |
| `/api/form-acompanhamento`| Formulários | Gestão de formulários de feedback periódicos |
| `/api/carga-horaria-minima`| Regras | Configuração de horas mínimas por curso |

---

## 🛡️ Segurança e Headers
Todas as rotas marcadas como **Autenticado** ou com **Roles específicas** exigem o envio do token JWT no cabeçalho da requisição:

```http
Authorization: Bearer seu_token_aqui
```
