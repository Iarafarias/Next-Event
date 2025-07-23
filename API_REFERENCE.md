# 🔗 NextEvent - API Reference

## 📍 Base URL
```
http://localhost:3000/api
```

---

## 🔐 Autenticação

Todas as rotas protegidas requerem o header:
```
Authorization: Bearer {jwt_token}
```

---

## 👥 Usuários

### **POST** `/users` - Criar usuário
```json
{
  "name": "João Silva",
  "email": "joao@teste.com", 
  "password": "senha123",
  "matricula": "USR001",
  "cpf": "12345678901",
  "role": "participant"
}
```

**Para criar ADMIN:**
```json
{
  "name": "Admin Sistema",
  "email": "admin@nextevent.com", 
  "password": "admin123",
  "matricula": "ADM001",
  "cpf": "98765432100",
  "role": "admin"
}
```

**⚠️ IMPORTANTE:** A criação de usuário é **PÚBLICA** (não requer autenticação). O campo `role` é opcional e aceita os valores:
- `"participant"` (padrão se omitido)
- `"admin"` (administrador com permissões especiais)

### **POST** `/users/login` - Login
```json
{
  "email": "joao@teste.com",
  "password": "senha123"
}
```

### **GET** `/users/me` - Dados do usuário logado
```json
// Resposta
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@teste.com",
  "role": "participant"
}
```

### **GET** `/users` - Listar usuários (ADMIN) 🔒
### **GET** `/users/{id}` - Buscar usuário por ID (ADMIN) 🔒
### **PUT** `/users/{id}` - Atualizar usuário (ADMIN) 🔒
### **DELETE** `/users/{id}` - Deletar usuário (ADMIN) 🔒

---

## 📄 Certificados

### **POST** `/certificates/upload` - Upload de certificado
```
Content-Type: multipart/form-data

FormData:
- file: [PDF file]
- title: "Nome do Certificado"
- description: "Descrição"
- institution: "Instituição"
- workload: 40
- startDate: "2025-07-01"
- endDate: "2025-07-31"
```

### **GET** `/certificates/user/{userId}` - Certificados do usuário
Query params opcionais:
- `status`: pending, approved, rejected

### **GET** `/certificates` - Todos os certificados (ADMIN)
### **GET** `/certificates/{id}` - Certificado por ID
### **PATCH** `/certificates/{id}/status` - Validar certificado (ADMIN)
```json
{
  "status": "approved",
  "adminComments": "Certificado válido"
}
```

### **DELETE** `/certificates/{id}` - Deletar certificado

---

## 🔔 Notificações

### **GET** `/notifications` - Listar notificações
Query params opcionais:
- `unread`: true (apenas não lidas)

### **GET** `/notifications/unread-count` - Contar não lidas
```json
// Resposta
{
  "count": 3
}
```

### **PATCH** `/notifications/{id}/read` - Marcar como lida
### **PATCH** `/notifications/mark-all-read` - Marcar todas como lidas
### **DELETE** `/notifications/{id}` - Deletar notificação

---

## 📊 Status Codes

- **200** - Sucesso
- **201** - Criado
- **400** - Bad Request
- **401** - Não autorizado
- **403** - Proibido
- **404** - Não encontrado
- **500** - Erro interno

---

## 🔔 Tipos de Notificação

- `certificate_approved` - Certificado aprovado
- `certificate_rejected` - Certificado rejeitado  
- `certificate_pending` - Certificado pendente
- `system_announcement` - Anúncio do sistema

---

## 🎯 Roles de Usuário

- **participant** - Usuário padrão
- **admin** - Administrador (pode validar certificados)

---

## 📝 Exemplos Completos

### Criar Usuário Admin (cURL)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Sistema",
    "email": "admin@nextevent.com",
    "password": "admin123",
    "matricula": "ADM001",
    "cpf": "98765432100",
    "role": "admin"
  }'
```

### Criar Usuário Admin (JavaScript)
```javascript
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Admin Sistema',
    email: 'admin@nextevent.com',
    password: 'admin123',
    matricula: 'ADM001',
    cpf: '98765432100',
    role: 'admin'
  })
});

const adminUser = await response.json();
```

### Upload de Certificado (JavaScript)
```javascript
const formData = new FormData();
formData.append('file', pdfFile);
formData.append('title', 'Curso de React');
formData.append('institution', 'Udemy');
formData.append('workload', '40');

const response = await fetch('/api/certificates/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Buscar Notificações (JavaScript)
```javascript
const response = await fetch('/api/notifications?unread=true', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.notifications);
```

### Marcar Notificação como Lida (JavaScript)
```javascript
await fetch(`/api/notifications/${notificationId}/read`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```
