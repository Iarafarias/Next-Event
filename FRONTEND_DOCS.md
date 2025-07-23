# 📚 NextEvent - Documentação Frontend

## 🎯 Visão Geral do Sistema

O **NextEvent** é um sistema de gestão de certificados onde:
- **Participantes** fazem upload de certificados em PDF
- **Administradores** validam (aprovam/rejeitam) os certificados
- **Sistema** envia notificações automáticas sobre o status dos certificados
- **Relatórios** são gerados com base nos certificados validados

---

## 🔐 Autenticação e Autorização

### Base URL
```
http://localhost:3000/api
```

### 1. **Login de Usuário**
```http
POST /users/login
Content-Type: application/json

{
  "email": "usuario@teste.com",
  "password": "senha123"
}
```

**Resposta de Sucesso:**
```json
{
  "user": {
    "id": "uuid-do-usuario",
    "name": "Nome do Usuário",
    "email": "usuario@teste.com",
    "role": "participant", // ou "admin"
    "isExistingUser": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta de Erro:**
```json
{
  "error": "Email or password incorrect"
}
```

### 2. **Cadastro de Usuário**
```http
POST /users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@teste.com",
  "password": "senha123",
  "matricula": "USR001",
  "cpf": "12345678901",
  "role": "participant" // opcional, padrão: "participant"
}
```

### 3. **Dados do Usuário Logado**
```http
GET /users/me
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "id": "uuid-do-usuario",
  "name": "João Silva",
  "email": "joao@teste.com",
  "matricula": "USR001",
  "role": "participant",
  "createdAt": "2025-07-22T10:00:00Z"
}
```

---

## 🏷️ Tipos de Usuário e Permissões

### **Participant (Participante)**
- ✅ Fazer upload de certificados
- ✅ Visualizar próprios certificados
- ✅ Receber e gerenciar notificações
- ❌ Validar certificados de outros usuários
- ❌ Gerar relatórios globais

### **Admin (Administrador)**
- ✅ Todas as permissões de participante
- ✅ Validar certificados (aprovar/rejeitar)
- ✅ Visualizar todos os certificados
- ✅ Gerar relatórios completos
- ✅ Gerenciar usuários

---

## 📄 APIs de Certificados

### 1. **Upload de Certificado**
```http
POST /certificates/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
- file: [arquivo PDF]
- title: "Nome do Certificado"
- description: "Descrição do certificado"
- institution: "Nome da Instituição"
- workload: 40 (carga horária em horas)
- startDate: "2025-07-01"
- endDate: "2025-07-31"
```

**Resposta de Sucesso:**
```json
{
  "id": "uuid-do-certificado",
  "userId": "uuid-do-usuario",
  "title": "Nome do Certificado",
  "description": "Descrição do certificado",
  "institution": "Nome da Instituição",
  "workload": 40,
  "startDate": "2025-07-01T00:00:00Z",
  "endDate": "2025-07-31T23:59:59Z",
  "certificateUrl": "/uploads/certificado.pdf",
  "status": "pending",
  "createdAt": "2025-07-22T10:00:00Z"
}
```

### 2. **Listar Certificados do Usuário**
```http
GET /certificates/user/{userId}?status=pending
Authorization: Bearer {token}
```

**Parâmetros de Query (opcionais):**
- `status`: `pending`, `approved`, `rejected`

**Resposta:**
```json
{
  "certificates": [
    {
      "id": "uuid-do-certificado",
      "title": "Nome do Certificado",
      "institution": "Nome da Instituição",
      "workload": 40,
      "status": "pending",
      "createdAt": "2025-07-22T10:00:00Z",
      "adminComments": null
    }
  ]
}
```

### 3. **Validar Certificado (ADMIN)**
```http
PATCH /certificates/{certificateId}/status
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "status": "approved", // ou "rejected"
  "adminComments": "Certificado válido e dentro dos critérios."
}
```

**Resposta:**
```json
{
  "id": "uuid-do-certificado",
  "status": "approved",
  "adminComments": "Certificado válido e dentro dos critérios.",
  "updatedAt": "2025-07-22T10:30:00Z"
}
```

**💡 Importante:** Esta ação **automaticamente envia uma notificação** para o participante!

---

## 🔔 APIs de Notificações

### 1. **Listar Notificações do Usuário**
```http
GET /notifications
Authorization: Bearer {token}
```

**Com Filtros:**
```http
GET /notifications?unread=true  // Apenas não lidas
```

**Resposta:**
```json
{
  "notifications": [
    {
      "id": "uuid-da-notificacao",
      "type": "certificate_approved",
      "title": "✅ Certificado Aprovado",
      "message": "Seu certificado \"Curso de React\" foi aprovado e validado com sucesso! Observação do administrador: Certificado válido.",
      "status": "unread",
      "relatedEntityId": "uuid-do-certificado",
      "relatedEntityType": "certificate",
      "createdAt": "2025-07-22T10:30:00Z",
      "readAt": null
    }
  ]
}
```

### 2. **Contar Notificações Não Lidas**
```http
GET /notifications/unread-count
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "count": 3
}
```

### 3. **Marcar Notificação como Lida**
```http
PATCH /notifications/{notificationId}/read
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "message": "Notificação marcada como lida"
}
```

### 4. **Marcar Todas como Lidas**
```http
PATCH /notifications/mark-all-read
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "message": "Todas as notificações foram marcadas como lidas"
}
```

---

## 📊 Tipos de Notificação

### **certificate_approved**
- **Título:** "✅ Certificado Aprovado"
- **Quando:** Administrador aprova um certificado
- **Ação Sugerida:** Mostrar badge verde, redirecionar para certificados

### **certificate_rejected**
- **Título:** "❌ Certificado Rejeitado"
- **Quando:** Administrador rejeita um certificado
- **Ação Sugerida:** Mostrar badge vermelho, exibir comentários do admin

### **certificate_pending**
- **Título:** "⏳ Certificado Pendente"
- **Quando:** Certificado enviado para validação
- **Ação Sugerida:** Mostrar badge amarelo

### **system_announcement**
- **Título:** "📢 Anúncio do Sistema"
- **Quando:** Comunicados gerais
- **Ação Sugerida:** Modal ou banner informativo

---

## 🎨 Componentes Frontend Sugeridos

### 1. **NotificationBadge**
```jsx
// Exemplo React
function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    const response = await fetch('/api/notifications/unread-count', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setUnreadCount(data.count);
  };

  return (
    <div className="notification-badge">
      🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
    </div>
  );
}
```

### 2. **NotificationList**
```jsx
function NotificationList() {
  const [notifications, setNotifications] = useState([]);

  const markAsRead = async (notificationId) => {
    await fetch(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    // Atualizar estado local
  };

  return (
    <div className="notification-list">
      {notifications.map(notification => (
        <NotificationCard 
          key={notification.id}
          notification={notification}
          onMarkAsRead={markAsRead}
        />
      ))}
    </div>
  );
}
```

### 3. **CertificateUpload**
```jsx
function CertificateUpload() {
  const handleSubmit = async (formData) => {
    const response = await fetch('/api/certificates/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData // FormData com arquivo + campos
    });
    
    if (response.ok) {
      // Sucesso: redirecionar ou mostrar confirmação
      showSuccess('Certificado enviado para validação!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept=".pdf" required />
      <input type="text" placeholder="Título" required />
      <input type="text" placeholder="Instituição" required />
      <input type="number" placeholder="Carga Horária" required />
      <input type="date" placeholder="Data Início" required />
      <input type="date" placeholder="Data Fim" required />
      <button type="submit">Enviar Certificado</button>
    </form>
  );
}
```

---

## 🔄 Fluxos de Usuário

### **Fluxo do Participante**

1. **Login/Cadastro**
   ```
   Login → Dashboard Participante
   ```

2. **Upload de Certificado**
   ```
   Dashboard → Upload → Formulário → Confirmação → Lista de Certificados
   ```

3. **Acompanhar Status**
   ```
   Lista de Certificados → Ver Status (Pending/Approved/Rejected)
   ```

4. **Receber Notificações**
   ```
   Notificação → Badge no Header → Lista de Notificações → Marcar como Lida
   ```

### **Fluxo do Administrador**

1. **Login**
   ```
   Login → Dashboard Admin
   ```

2. **Validar Certificados**
   ```
   Dashboard → Lista de Pendentes → Ver Certificado → Aprovar/Rejeitar + Comentários
   ```

3. **Visualizar Relatórios**
   ```
   Dashboard → Relatórios → Filtros (mês/ano) → Dados Consolidados
   ```

---

## 📱 Estados de Interface

### **Status de Certificado**
```css
.status-pending { 
  background: #fef3cd; 
  color: #856404; 
  border: 1px solid #ffeaa7; 
}

.status-approved { 
  background: #d1f2eb; 
  color: #0f5132; 
  border: 1px solid #86efac; 
}

.status-rejected { 
  background: #f8d7da; 
  color: #721c24; 
  border: 1px solid #fca5a5; 
}
```

### **Tipos de Notificação**
```css
.notification-approved {
  border-left: 4px solid #10b981;
}

.notification-rejected {
  border-left: 4px solid #ef4444;
}

.notification-pending {
  border-left: 4px solid #f59e0b;
}

.notification-unread {
  background: #f8fafc;
  font-weight: 600;
}
```

---

## 🔒 Middleware de Autenticação

### **Headers Necessários**
```javascript
const authHeaders = {
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
};
```

### **Interceptor de Requisições (Axios)**
```javascript
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 🚦 Estados de Loading e Erro

### **Estados Comuns**
```typescript
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Exemplo de uso
const [certificatesState, setCertificatesState] = useState<ApiState<Certificate[]>>({
  data: null,
  loading: false,
  error: null
});
```

### **Componente de Loading**
```jsx
function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Carregando...</p>
    </div>
  );
}
```

### **Tratamento de Erros**
```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Erro da API
    const message = error.response.data?.error || 'Erro no servidor';
    showError(message);
  } else if (error.request) {
    // Erro de rede
    showError('Erro de conexão. Verifique sua internet.');
  } else {
    // Erro genérico
    showError('Erro inesperado. Tente novamente.');
  }
};
```

---

## 🔄 WebSocket/Polling para Notificações

### **Polling de Notificações (Recomendado)**
```javascript
// Verificar notificações a cada 30 segundos
useEffect(() => {
  const interval = setInterval(() => {
    fetchUnreadCount();
  }, 30000);

  return () => clearInterval(interval);
}, []);
```

### **WebSocket (Futuro)**
```javascript
// Para implementação futura
const ws = new WebSocket('ws://localhost:3000/ws');
ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  addNotification(notification);
  updateUnreadCount();
};
```

---

## 📋 Validações Frontend

### **Upload de Arquivo**
```javascript
const validateFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('Arquivo é obrigatório');
  } else {
    if (file.type !== 'application/pdf') {
      errors.push('Apenas arquivos PDF são aceitos');
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      errors.push('Arquivo deve ter no máximo 10MB');
    }
  }
  
  return errors;
};
```

### **Campos Obrigatórios**
```javascript
const validateCertificate = (data) => {
  const errors = {};
  
  if (!data.title?.trim()) {
    errors.title = 'Título é obrigatório';
  }
  if (!data.institution?.trim()) {
    errors.institution = 'Instituição é obrigatória';
  }
  if (!data.workload || data.workload < 1) {
    errors.workload = 'Carga horária deve ser maior que 0';
  }
  if (!data.startDate) {
    errors.startDate = 'Data de início é obrigatória';
  }
  if (!data.endDate) {
    errors.endDate = 'Data de fim é obrigatória';
  }
  if (new Date(data.startDate) > new Date(data.endDate)) {
    errors.dateRange = 'Data de início deve ser anterior à data de fim';
  }
  
  return errors;
};
```

---

## 🎯 URLs e Rotas Frontend

### **Estrutura Sugerida**
```
/login                    # Login
/register                 # Cadastro
/dashboard               # Dashboard (diferente por role)

# Participante
/certificates            # Lista de certificados
/certificates/upload     # Upload de certificado
/notifications          # Lista de notificações

# Admin
/admin/certificates     # Todos os certificados para validação
/admin/reports          # Relatórios e estatísticas
/admin/users            # Gerenciar usuários
```

### **Roteamento Protegido**
```jsx
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, token } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
}

// Uso
<Route path="/admin/*" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

## 🔧 Utilitários Auxiliares

### **Formatação de Data**
```javascript
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
```

### **Status Display**
```javascript
export const getStatusDisplay = (status) => {
  const statusMap = {
    pending: { text: 'Pendente', color: 'warning', icon: '⏳' },
    approved: { text: 'Aprovado', color: 'success', icon: '✅' },
    rejected: { text: 'Rejeitado', color: 'error', icon: '❌' }
  };
  
  return statusMap[status] || statusMap.pending;
};
```

### **File Size Format**
```javascript
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
```

---

## 🌟 Funcionalidades Avançadas

### **1. Busca e Filtros**
```javascript
// Para lista de certificados
const [filters, setFilters] = useState({
  status: 'all',
  institution: '',
  dateRange: { start: '', end: '' },
  searchTerm: ''
});

const filteredCertificates = certificates.filter(cert => {
  return (filters.status === 'all' || cert.status === filters.status) &&
         (filters.institution === '' || cert.institution.includes(filters.institution)) &&
         (filters.searchTerm === '' || cert.title.toLowerCase().includes(filters.searchTerm.toLowerCase()));
});
```

### **2. Paginação**
```javascript
const [pagination, setPagination] = useState({
  page: 1,
  limit: 10,
  total: 0
});

const fetchCertificates = async (page = 1) => {
  const response = await fetch(`/api/certificates?page=${page}&limit=${pagination.limit}`);
  const data = await response.json();
  
  setCertificates(data.certificates);
  setPagination(prev => ({ ...prev, total: data.total }));
};
```

### **3. Cache Local**
```javascript
// Usar localStorage ou sessionStorage para cache
const CACHE_KEYS = {
  CERTIFICATES: 'certificates_cache',
  USER_PROFILE: 'user_profile_cache'
};

const setCache = (key, data, expiry = 5 * 60 * 1000) => { // 5 minutos
  const item = {
    data,
    timestamp: Date.now(),
    expiry
  };
  localStorage.setItem(key, JSON.stringify(item));
};

const getCache = (key) => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  
  const parsed = JSON.parse(item);
  if (Date.now() - parsed.timestamp > parsed.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  
  return parsed.data;
};
```

---

## 🚀 Deploy e Build

### **Variáveis de Ambiente**
```env
# .env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_WS_URL=ws://localhost:3000/ws
REACT_APP_MAX_FILE_SIZE=10485760
```

### **Build de Produção**
```json
// package.json scripts
{
  "scripts": {
    "build:dev": "NODE_ENV=development npm run build",
    "build:prod": "NODE_ENV=production npm run build"
  }
}
```

---

## 📞 Suporte e Debugging

### **Logs Úteis**
```javascript
// Para debugging das requisições
const logRequest = (method, url, data) => {
  console.group(`🌐 ${method.toUpperCase()} ${url}`);
  console.log('Data:', data);
  console.log('Token:', localStorage.getItem('token') ? 'Present' : 'Missing');
  console.groupEnd();
};
```

### **Testando APIs**
```bash
# Testar login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@teste.com", "password": "user123"}'

# Testar notificações
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/notifications
```

---

## 🎨 Biblioteca de Componentes Recomendada

### **Material-UI / Ant Design / Chakra UI**
- **Notification Badge**
- **File Upload Dropzone**
- **Data Tables**
- **Modal/Dialog**
- **Loading Spinners**
- **Toast Notifications**

### **Exemplo com Material-UI**
```jsx
import { Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

function NotificationIcon({ unreadCount }) {
  return (
    <IconButton>
      <Badge badgeContent={unreadCount} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
}
```

---

**🎯 Esta documentação cobre todos os aspectos necessários para desenvolver o frontend do NextEvent. Para dúvidas específicas, consulte os exemplos de código ou teste as APIs diretamente!**
