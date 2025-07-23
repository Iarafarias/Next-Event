# 🗄️ NextEvent - Database Schema

## 📋 Estrutura das Tabelas

### **users** - Usuários do sistema
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE,
    role VARCHAR(20) DEFAULT 'participant' CHECK (role IN ('participant', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **certificates** - Certificados dos usuários
```sql
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    institution VARCHAR(255) NOT NULL,
    workload INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    certificate_url VARCHAR(500) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **notifications** - Notificações do sistema
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read')),
    related_entity_id UUID,
    related_entity_type VARCHAR(50),
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔗 Relacionamentos

### **1:N - Usuário → Certificados**
- Um usuário pode ter vários certificados
- Cada certificado pertence a um usuário
- `certificates.user_id` → `users.id`

### **1:N - Usuário → Notificações** 
- Um usuário pode ter várias notificações
- Cada notificação pertence a um usuário
- `notifications.user_id` → `users.id`

### **Referência Opcional - Notificação → Entidade**
- Notificações podem referenciar certificados
- `notifications.related_entity_id` → `certificates.id` (quando `related_entity_type = 'certificate'`)

---

## 🔑 Índices Recomendados

```sql
-- Busca por email (login)
CREATE INDEX idx_users_email ON users(email);

-- Busca por matrícula
CREATE INDEX idx_users_matricula ON users(matricula);

-- Certificados por usuário
CREATE INDEX idx_certificates_user_id ON certificates(user_id);

-- Certificados por status
CREATE INDEX idx_certificates_status ON certificates(status);

-- Notificações por usuário
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Notificações não lidas
CREATE INDEX idx_notifications_status ON notifications(status);

-- Notificações por data (para limpeza)
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

---

## 📊 Dados de Exemplo

### **Usuários**
```sql
-- Admin
INSERT INTO users (name, email, password, matricula, role) VALUES 
('Admin Sistema', 'admin@nextevent.com', '$2a$10$hashedpassword', 'ADM001', 'admin');

-- Participantes
INSERT INTO users (name, email, password, matricula, cpf) VALUES 
('João Silva', 'joao@teste.com', '$2a$10$hashedpassword', 'USR001', '12345678901'),
('Maria Santos', 'maria@teste.com', '$2a$10$hashedpassword', 'USR002', '98765432109');
```

### **Certificados**
```sql
INSERT INTO certificates (user_id, title, institution, workload, start_date, end_date, certificate_url) VALUES 
((SELECT id FROM users WHERE email = 'joao@teste.com'), 
 'Curso de React.js', 
 'Udemy', 
 40, 
 '2025-06-01', 
 '2025-06-30', 
 '/uploads/react-certificate.pdf');
```

### **Notificações**
```sql
INSERT INTO notifications (user_id, type, title, message, related_entity_id, related_entity_type) VALUES
((SELECT id FROM users WHERE email = 'joao@teste.com'),
 'certificate_approved',
 '✅ Certificado Aprovado',
 'Seu certificado "Curso de React.js" foi aprovado!',
 (SELECT id FROM certificates WHERE title = 'Curso de React.js'),
 'certificate');
```

---

## 🔒 Constraints e Validações

### **Roles Válidos**
```sql
CHECK (role IN ('participant', 'admin'))
```

### **Status de Certificado**
```sql
CHECK (status IN ('pending', 'approved', 'rejected'))
```

### **Status de Notificação**
```sql
CHECK (status IN ('unread', 'read'))
```

### **Email Único**
```sql
UNIQUE (email)
```

### **Matrícula Única**
```sql
UNIQUE (matricula)
```

### **CPF Único (se informado)**
```sql
UNIQUE (cpf)
```

---

## 🔄 Triggers Úteis

### **Atualizar updated_at automaticamente**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at 
    BEFORE UPDATE ON certificates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **Limpeza automática de notificações antigas**
```sql
-- Função para limpar notificações antigas (30 dias)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
    DELETE FROM notifications 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Executar manualmente ou via cron job
-- SELECT cleanup_old_notifications();
```

---

## 📊 Consultas Úteis

### **Estatísticas de Certificados por Usuário**
```sql
SELECT 
    u.name,
    u.email,
    COUNT(c.id) as total_certificates,
    COUNT(CASE WHEN c.status = 'approved' THEN 1 END) as approved,
    COUNT(CASE WHEN c.status = 'rejected' THEN 1 END) as rejected,
    COUNT(CASE WHEN c.status = 'pending' THEN 1 END) as pending
FROM users u
LEFT JOIN certificates c ON u.id = c.user_id
WHERE u.role = 'participant'
GROUP BY u.id, u.name, u.email
ORDER BY total_certificates DESC;
```

### **Certificados Pendentes para Validação**
```sql
SELECT 
    c.id,
    c.title,
    c.institution,
    u.name as user_name,
    u.email as user_email,
    c.created_at
FROM certificates c
JOIN users u ON c.user_id = u.id
WHERE c.status = 'pending'
ORDER BY c.created_at ASC;
```

### **Notificações Não Lidas por Usuário**
```sql
SELECT 
    u.name,
    u.email,
    COUNT(n.id) as unread_notifications
FROM users u
LEFT JOIN notifications n ON u.id = n.user_id AND n.status = 'unread'
GROUP BY u.id, u.name, u.email
HAVING COUNT(n.id) > 0
ORDER BY unread_notifications DESC;
```

### **Relatório de Produtividade Mensal**
```sql
SELECT 
    DATE_TRUNC('month', c.created_at) as month,
    COUNT(*) as total_uploaded,
    COUNT(CASE WHEN c.status = 'approved' THEN 1 END) as approved,
    COUNT(CASE WHEN c.status = 'rejected' THEN 1 END) as rejected,
    ROUND(
        COUNT(CASE WHEN c.status = 'approved' THEN 1 END)::decimal / 
        COUNT(*)::decimal * 100, 2
    ) as approval_rate
FROM certificates c
WHERE c.created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', c.created_at)
ORDER BY month DESC;
```

---

## 🚀 Performance Tips

### **1. Paginação Eficiente**
```sql
-- Em vez de OFFSET (lento para grandes datasets)
SELECT * FROM certificates 
WHERE user_id = $1 AND created_at < $2 
ORDER BY created_at DESC 
LIMIT 10;
```

### **2. Busca com Full Text Search**
```sql
-- Adicionar coluna de busca
ALTER TABLE certificates ADD COLUMN search_vector tsvector;

-- Atualizar índice de busca
UPDATE certificates SET search_vector = 
    to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(institution, ''));

-- Criar índice GIN
CREATE INDEX idx_certificates_search ON certificates USING gin(search_vector);

-- Buscar
SELECT * FROM certificates 
WHERE search_vector @@ plainto_tsquery('portuguese', 'react javascript');
```

### **3. Particionamento por Data (Para grandes volumes)**
```sql
-- Particionar notificações por mês
CREATE TABLE notifications_y2025m01 PARTITION OF notifications
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

---

## 🔧 Backup e Manutenção

### **Backup Diário**
```bash
# Backup completo
pg_dump nextevent_db > backup_$(date +%Y%m%d).sql

# Backup apenas dados
pg_dump --data-only nextevent_db > data_backup_$(date +%Y%m%d).sql
```

### **Limpeza de Dados**
```sql
-- Limpar notificações antigas (30 dias)
DELETE FROM notifications WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '30 days';

-- Limpar certificados rejeitados antigos (90 dias)
DELETE FROM certificates 
WHERE status = 'rejected' 
AND updated_at < CURRENT_TIMESTAMP - INTERVAL '90 days';
```

### **Reindexação**
```sql
-- Recriar índices se necessário
REINDEX INDEX idx_certificates_user_id;
REINDEX TABLE notifications;
```

---

**💡 Esta documentação cobre toda a estrutura do banco de dados NextEvent, incluindo otimizações e consultas úteis para relatórios!**
