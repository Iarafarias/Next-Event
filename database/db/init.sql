-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários (compatível com Prisma User model)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  matricula VARCHAR(20) UNIQUE NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'participant',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enum para status de certificados
CREATE TYPE certificate_status AS ENUM ('pending', 'approved', 'rejected');

-- Tabela de solicitações de certificados (compatível com Prisma CertificateRequest)
CREATE TABLE IF NOT EXISTS certificate_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de certificados (compatível com Prisma Certificate model)
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES certificate_requests(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  institution VARCHAR(255) NOT NULL,
  workload INTEGER NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  certificate_url TEXT NOT NULL,
  status certificate_status DEFAULT 'pending',
  admin_comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notificações (compatível com Prisma Notification model)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unread',
  related_entity_id UUID,
  related_entity_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);

-- Inserir usuário administrador padrão (senha: admin123)
INSERT INTO users (name, email, password, matricula, cpf, role) 
VALUES (
  'Administrador',
  'admin@nextevent.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'admin123'
  'ADM001',
  '00000000000',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Inserir usuário participante de exemplo (senha: user123)
INSERT INTO users (name, email, password, matricula, cpf, role) 
VALUES (
  'João Silva',
  'joao@teste.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'user123'
  'USR001',
  '11111111111',
  'participant'
) ON CONFLICT (email) DO NOTHING;

-- Inserir solicitação de certificados padrão para julho 2025
INSERT INTO certificate_requests (id, month, year, start_date, end_date, status, description) 
VALUES (
  uuid_generate_v4(),
  7,
  2025,
  '2025-07-01 00:00:00',
  '2025-07-31 23:59:59',
  'open',
  'Período de validação de certificados - Julho 2025'
) ON CONFLICT DO NOTHING;