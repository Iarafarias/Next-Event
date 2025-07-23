# 🚀 NextEvent - Guia de Setup Frontend

## 📋 Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- **VS Code** (recomendado)

---

## 🎯 Stack Recomendada

### **Framework Principal**
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **React Router v6** (roteamento)

### **Gerenciamento de Estado**
- **Zustand** (simples) ou **Redux Toolkit** (complexo)
- **React Query/TanStack Query** (cache de API)

### **UI Components**
- **Material-UI (MUI)** ou **Ant Design** ou **Chakra UI**
- **React Hook Form** (formulários)
- **React Dropzone** (upload de arquivos)

### **Utilitários**
- **Axios** (HTTP client)
- **Day.js** (manipulação de datas)
- **React Hot Toast** (notificações)

---

## 📦 Setup Inicial

### **1. Criar Projeto**
```bash
# Criar projeto React com Vite
npm create vite@latest nextevent-frontend -- --template react-ts
cd nextevent-frontend
npm install
```

### **2. Instalar Dependências**
```bash
# Core dependencies
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-router-dom
npm install axios
npm install @tanstack/react-query
npm install zustand
npm install react-hook-form
npm install react-dropzone
npm install dayjs
npm install react-hot-toast

# Dev dependencies
npm install -D @types/node
```

### **3. Configurar Vite (vite.config.ts)**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

---

## 📁 Estrutura de Pastas

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes básicos (Button, Input, etc)
│   ├── layout/          # Layout (Header, Sidebar, etc)
│   └── forms/           # Formulários específicos
├── pages/               # Páginas/rotas
│   ├── auth/           # Login, Register
│   ├── dashboard/      # Dashboard
│   ├── certificates/   # Gestão de certificados
│   └── notifications/  # Notificações
├── hooks/              # Custom hooks
├── services/           # API calls
├── stores/             # Zustand stores
├── types/              # TypeScript types
├── utils/              # Funções utilitárias
└── constants/          # Constantes da aplicação
```

---

## 🔧 Configuração Base

### **1. Configurar Tema (src/theme.ts)**
```typescript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#ed6c02',
    },
    error: {
      main: '#d32f2f',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

### **2. Setup do Router (src/App.tsx)**
```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CertificatesPage from './pages/certificates/CertificatesPage';
import NotificationsPage from './pages/notifications/NotificationsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="/certificates" element={
                <ProtectedRoute>
                  <CertificatesPage />
                </ProtectedRoute>
              } />
              
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
```

### **3. Context de Autenticação (src/contexts/AuthContext.tsx)**
```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/User';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🔌 Services (APIs)

### **API Client Base (src/services/api.ts)**
```typescript
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error('Erro inesperado. Tente novamente.');
    }
    return Promise.reject(error);
  }
);
```

### **Auth Service (src/services/authService.ts)**
```typescript
import { api } from './api';
import { User } from '../types/User';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  matricula: string;
  cpf?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post('/users', data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  },
};
```

### **Certificates Service (src/services/certificatesService.ts)**
```typescript
import { api } from './api';
import { Certificate } from '../types/Certificate';

interface UploadCertificateData {
  file: File;
  title: string;
  description?: string;
  institution: string;
  workload: number;
  startDate: string;
  endDate: string;
}

export const certificatesService = {
  async upload(data: UploadCertificateData): Promise<Certificate> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    formData.append('description', data.description || '');
    formData.append('institution', data.institution);
    formData.append('workload', data.workload.toString());
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);

    const response = await api.post('/certificates/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getUserCertificates(userId: string, status?: string): Promise<Certificate[]> {
    const params = status ? { status } : {};
    const response = await api.get(`/certificates/user/${userId}`, { params });
    return response.data.certificates;
  },

  async updateStatus(certificateId: string, status: string, adminComments?: string) {
    const response = await api.patch(`/certificates/${certificateId}/status`, {
      status,
      adminComments,
    });
    return response.data;
  },
};
```

---

## 🎨 Componentes Base

### **Protected Route (src/components/ProtectedRoute.tsx)**
```tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### **Layout Component (src/components/layout/Layout.tsx)**
```tsx
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box } from '@mui/material';
import { Notifications, ExitToApp } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NextEvent
          </Typography>
          
          <Typography variant="body2" sx={{ mr: 2 }}>
            Olá, {user?.name}
          </Typography>

          <IconButton color="inherit" onClick={() => navigate('/notifications')}>
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
```

---

## 🎯 Custom Hooks

### **useNotifications (src/hooks/useNotifications.ts)**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notificationsService';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsService.getAll,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationsService.getUnreadCount,
    refetchInterval: 30000, // Recarregar a cada 30 segundos
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('Todas as notificações foram marcadas como lidas');
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};
```

---

## 📱 Páginas Principais

### **Login Page (src/pages/auth/LoginPage.tsx)**
```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      // Erro já tratado pelo interceptor
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            NextEvent
          </Typography>
          
          <Typography variant="h6" gutterBottom align="center" color="textSecondary">
            Entre na sua conta
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <TextField
              {...register('email', { 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              fullWidth
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              margin="normal"
            />

            <TextField
              {...register('password', { required: 'Senha é obrigatória' })}
              fullWidth
              label="Senha"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>

            <Box textAlign="center">
              <Link to="/register">
                Não tem conta? Cadastre-se
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
```

---

## 🔧 Configurações Finais

### **Environment Variables (.env)**
```env
VITE_API_URL=http://localhost:3000/api
VITE_MAX_FILE_SIZE=10485760
```

### **TypeScript Types (src/types/)**

**User.ts**
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  matricula: string;
  role: 'participant' | 'admin';
  createdAt: string;
}
```

**Certificate.ts**
```typescript
export interface Certificate {
  id: string;
  userId: string;
  title: string;
  description?: string;
  institution: string;
  workload: number;
  startDate: string;
  endDate: string;
  certificateUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  adminComments?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Notification.ts**
```typescript
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  status: 'unread' | 'read';
  relatedEntityId?: string;
  relatedEntityType?: string;
  readAt?: string;
  createdAt: string;
}
```

---

## 🚀 Scripts de Desenvolvimento

### **package.json scripts**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

### **Executar Projeto**
```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

---

**🎯 Com este setup, o frontend estará completamente configurado e pronto para desenvolvimento! Siga esta estrutura para manter o código organizado e escalável.**
