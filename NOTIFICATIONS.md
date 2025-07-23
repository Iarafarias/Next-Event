# Sistema de Notificações - NextEvent

## Visão Geral

O sistema de notificações foi implementado para avisar os usuários quando seus certificados são validados (aprovados ou rejeitados) pelos administradores.

## Funcionalidades Implementadas

### 1. **Entidade Notification**
- Tipos de notificação: `certificate_approved`, `certificate_rejected`, `certificate_pending`, `system_announcement`
- Status: `unread`, `read`
- Relacionamento com entidades (certificados, usuários)
- Expiração automática

### 2. **APIs de Notificação**

#### **GET /api/notifications**
Busca todas as notificações do usuário autenticado
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/notifications
```

#### **GET /api/notifications?unread=true**
Busca apenas notificações não lidas
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/notifications?unread=true
```

#### **GET /api/notifications/unread-count**
Retorna a quantidade de notificações não lidas
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/notifications/unread-count
```

#### **PATCH /api/notifications/:id/read**
Marca uma notificação específica como lida
```bash
curl -X PATCH -H "Authorization: Bearer <token>" http://localhost:3000/api/notifications/123/read
```

#### **PATCH /api/notifications/mark-all-read**
Marca todas as notificações do usuário como lidas
```bash
curl -X PATCH -H "Authorization: Bearer <token>" http://localhost:3000/api/notifications/mark-all-read
```

### 3. **Integração com Validação de Certificados**

Quando um administrador aprova ou rejeita um certificado via:
```bash
PATCH /api/certificates/:id/status
{
  "status": "approved", // ou "rejected"
  "adminComments": "Certificado válido e dentro dos critérios."
}
```

**Automaticamente será enviada uma notificação para o usuário:**

#### Exemplo de notificação de aprovação:
```json
{
  "id": "uuid",
  "type": "certificate_approved",
  "title": "✅ Certificado Aprovado",
  "message": "Seu certificado \"certificado.pdf\" foi aprovado e validado com sucesso! Observação do administrador: Certificado válido e dentro dos critérios.",
  "status": "unread",
  "relatedEntityId": "certificate-id",
  "relatedEntityType": "certificate",
  "createdAt": "2025-07-22T23:15:00Z"
}
```

#### Exemplo de notificação de rejeição:
```json
{
  "id": "uuid",
  "type": "certificate_rejected", 
  "title": "❌ Certificado Rejeitado",
  "message": "Seu certificado \"certificado.pdf\" foi rejeitado. Observação do administrador: Documento ilegível, favor reenviar com melhor qualidade.",
  "status": "unread",
  "relatedEntityId": "certificate-id",
  "relatedEntityType": "certificate",
  "createdAt": "2025-07-22T23:15:00Z"
}
```

## Banco de Dados

### Tabela `notifications`
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR DEFAULT 'unread',
  related_entity_id UUID,
  related_entity_type VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);
```

## Fluxo de Trabalho

1. **Participante** faz upload de certificado
2. **Administrador** visualiza certificados pendentes
3. **Administrador** aprova/rejeita certificado via API
4. **Sistema** automaticamente cria notificação para o participante
5. **Participante** recebe notificação em tempo real
6. **Participante** pode marcar notificação como lida

## Próximos Passos Sugeridos

### 1. **Notificações em Tempo Real**
- Implementar WebSocket ou Server-Sent Events
- Notificações push no frontend

### 2. **Templates de Notificação**
- Sistema de templates personalizáveis
- Suporte a múltiplos idiomas

### 3. **Configurações de Notificação**
- Permitir usuário escolher tipos de notificação
- Configuração de frequência (imediata, diária, semanal)

### 4. **Notificações por Email**
- Integração com serviços de email (SendGrid, SES)
- Templates HTML para emails

### 5. **Limpeza Automática**
- Job/cron para excluir notificações antigas
- Configuração de retenção por tipo

## Testes

Para testar o sistema completo:

1. **Criar usuário participante**
2. **Fazer login e obter token** 
3. **Fazer upload de certificado**
4. **Login como admin e aprovar/rejeitar**
5. **Verificar notificações do participante**

```bash
# 1. Login participante
curl -X POST http://localhost:3000/api/users/auth \
  -H "Content-Type: application/json" \
  -d '{"email": "participante@teste.com", "password": "123456"}'

# 2. Verificar notificações
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/notifications

# 3. Login admin
curl -X POST http://localhost:3000/api/users/auth \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@teste.com", "password": "123456"}'

# 4. Aprovar certificado
curl -X PATCH http://localhost:3000/api/certificates/cert-id/status \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved", "adminComments": "Aprovado!"}'
```
