# 👤 EDITAR PERFIL DO USUÁRIO - GUIA COMPLETO

## 🎯 **Resumo da Implementação**

✅ **Rota Criada**: `PUT /api/users/me`  
✅ **Autenticação**: Obrigatória (Bearer Token)  
✅ **Autorização**: Admin ou Participant  
✅ **Campos Editáveis**: name, email, password, matricula, cpf  

---

## 🚀 **Exemplo: Componente de Edição de Perfil**

### **EditProfile.jsx**
```jsx
import React, { useState, useEffect } from 'react';

const EditProfile = ({ user, token, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    matricula: '',
    cpf: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  // Preencher formulário com dados atuais do usuário
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        matricula: user.matricula || '',
        cpf: user.cpf || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro específico quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nome
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validar email
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validar senha (se fornecida)
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Validar confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    // Validar CPF (formato básico)
    if (formData.cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF inválido (formato: 000.000.000-00)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCPF = (value) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica máscara
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    return value;
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Preparar dados para envio (remover campos vazios)
      const updateData = {};
      
      if (formData.name.trim() !== user.name) {
        updateData.name = formData.name.trim();
      }
      
      if (formData.email.trim() !== user.email) {
        updateData.email = formData.email.trim();
      }
      
      if (formData.password.trim()) {
        updateData.password = formData.password;
      }
      
      if (formData.matricula.trim() !== user.matricula) {
        updateData.matricula = formData.matricula.trim();
      }
      
      if (formData.cpf.replace(/\D/g, '') !== user.cpf?.replace(/\D/g, '')) {
        updateData.cpf = formData.cpf.replace(/\D/g, ''); // Enviar apenas números
      }

      // Verificar se há alterações
      if (Object.keys(updateData).length === 0) {
        onError?.('Nenhuma alteração foi feita');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Erro HTTP ${response.status}`);
      }

      // Limpar senha do formulário
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));

      onSuccess?.(data.user, data.message);

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      onError?.(error.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    return (
      formData.name.trim() !== user.name ||
      formData.email.trim() !== user.email ||
      formData.password.trim() !== '' ||
      formData.matricula.trim() !== user.matricula ||
      formData.cpf.replace(/\D/g, '') !== (user.cpf?.replace(/\D/g, '') || '')
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Editar Perfil
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Seu nome completo"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Matrícula */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matrícula
            </label>
            <input
              type="text"
              name="matricula"
              value={formData.matricula}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Sua matrícula"
            />
          </div>

          {/* CPF */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPF
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleCPFChange}
              maxLength={14}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.cpf ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="000.000.000-00"
            />
            {errors.cpf && (
              <p className="mt-1 text-sm text-red-600">{errors.cpf}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nova Senha (deixe em branco para não alterar)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nova senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          {formData.password && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Nova Senha *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirme a nova senha"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !hasChanges()}
              className={`
                flex-1 py-2 px-4 rounded-lg font-medium transition-colors
                ${loading || !hasChanges()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Salvando...
                </span>
              ) : (
                'Salvar Alterações'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>

        {/* Indicador de alterações */}
        {hasChanges() && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              ⚠️ Você tem alterações não salvas
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
```

---

## 🔧 **Service para Perfil**

### **profileService.js**
```javascript
class ProfileService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  }

  // Obter dados do perfil atual
  async getProfile(token) {
    try {
      const response = await fetch(`${this.baseURL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar perfil');
      }

      return data;
    } catch (error) {
      console.error('Profile service - getProfile error:', error);
      throw error;
    }
  }

  // Atualizar perfil
  async updateProfile(updateData, token) {
    try {
      const response = await fetch(`${this.baseURL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar perfil');
      }

      return data;
    } catch (error) {
      console.error('Profile service - updateProfile error:', error);
      throw error;
    }
  }

  // Validar dados antes do envio
  validateProfileData(formData, originalUser) {
    const errors = {};
    const updateData = {};

    // Validar nome
    if (formData.name?.trim()) {
      if (formData.name.trim().length < 2) {
        errors.name = 'Nome deve ter pelo menos 2 caracteres';
      } else if (formData.name.trim() !== originalUser.name) {
        updateData.name = formData.name.trim();
      }
    }

    // Validar email
    if (formData.email?.trim()) {
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email inválido';
      } else if (formData.email.trim() !== originalUser.email) {
        updateData.email = formData.email.trim();
      }
    }

    // Validar senha
    if (formData.password?.trim()) {
      if (formData.password.length < 6) {
        errors.password = 'Senha deve ter pelo menos 6 caracteres';
      } else {
        updateData.password = formData.password;
      }
    }

    // Validar matrícula
    if (formData.matricula?.trim() !== originalUser.matricula) {
      updateData.matricula = formData.matricula?.trim();
    }

    // Validar CPF
    if (formData.cpf) {
      const cleanCPF = formData.cpf.replace(/\D/g, '');
      const originalCPF = originalUser.cpf?.replace(/\D/g, '') || '';
      
      if (cleanCPF && !/^\d{11}$/.test(cleanCPF)) {
        errors.cpf = 'CPF deve conter 11 dígitos';
      } else if (cleanCPF !== originalCPF) {
        updateData.cpf = cleanCPF;
      }
    }

    return { errors, updateData };
  }
}

export default new ProfileService();
```

---

## 📱 **Hook Customizado**

### **useProfile.js**
```javascript
import { useState, useEffect } from 'react';
import profileService from '../services/profileService';

export const useProfile = (token) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getProfile(token);
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updateData) => {
    try {
      const response = await profileService.updateProfile(updateData, token);
      
      // Atualizar estado local
      setProfile(response.user);
      
      return response;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (token) {
      loadProfile();
    }
  }, [token]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    reload: loadProfile,
  };
};
```

---

## 🌐 **Página Completa**

### **ProfilePage.jsx**
```jsx
import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import EditProfile from '../components/EditProfile';

const ProfilePage = () => {
  const { token } = useAuth();
  const { profile, loading, error, updateProfile, reload } = useProfile(token);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleUpdateSuccess = (updatedUser, message) => {
    showNotification(message || 'Perfil atualizado com sucesso!', 'success');
    // O hook já atualiza o estado local
  };

  const handleUpdateError = (error) => {
    showNotification(error, 'error');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Erro ao carregar perfil
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={reload}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Notificação */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`
            p-4 rounded-lg shadow-lg max-w-sm
            ${notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : ''}
            ${notification.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : ''}
            ${notification.type === 'info' ? 'bg-blue-50 border border-blue-200 text-blue-800' : ''}
          `}>
            <div className="flex items-center gap-3">
              <span className="text-xl">
                {notification.type === 'success' ? '✅' : ''}
                {notification.type === 'error' ? '❌' : ''}
                {notification.type === 'info' ? 'ℹ️' : ''}
              </span>
              <p className="font-medium">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="max-w-2xl mx-auto px-6 mb-8">
        <nav className="text-sm text-gray-600 mb-4">
          <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Editar Perfil</span>
        </nav>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profile?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.name || 'Usuário'}
              </h1>
              <p className="text-gray-600">{profile?.email}</p>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {profile?.role === 'admin' ? '👑 Admin' : '👤 Participante'}
                </span>
                {profile?.matricula && (
                  <span>🎓 {profile.matricula}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de edição */}
      <EditProfile
        user={profile}
        token={token}
        onSuccess={handleUpdateSuccess}
        onError={handleUpdateError}
      />
    </div>
  );
};

export default ProfilePage;
```

---

## 🧪 **Teste da API**

### **Teste no Frontend (JavaScript)**
```javascript
// Exemplo de teste manual
const testUpdateProfile = async () => {
  const token = 'seu_jwt_token_aqui';
  
  const updateData = {
    name: 'João Silva Santos',
    email: 'joao.novo@email.com'
  };

  try {
    const response = await fetch('http://localhost:3000/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();
    console.log('Resposta:', data);
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

### **Teste no Terminal (curl)**
```bash
# Obter perfil atual
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Atualizar perfil
curl -X PUT http://localhost:3000/api/users/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Novo Nome",
    "email": "novo@email.com"
  }'
```

---

## 🎯 **Fluxo Recomendado**

1. **Navbar**: Usuário clica no nome → redireciona para `/profile/edit`
2. **Profile Page**: Carrega dados atuais via `GET /api/users/me`
3. **Edit Form**: Preenche formulário com dados atuais
4. **Submit**: Envia apenas campos alterados via `PUT /api/users/me`
5. **Success**: Atualiza estado local e mostra notificação

---

## 🔒 **Recursos de Segurança**

✅ **Autenticação obrigatória**: Token JWT necessário  
✅ **Autorização por role**: Admin e Participant podem editar  
✅ **Validação de dados**: Email, CPF, senha, etc.  
✅ **Proteção contra duplicatas**: Email e matrícula únicos  
✅ **Sanitização**: Remove espaços e caracteres especiais  
✅ **Não exposição de senha**: Senha nunca retornada nas respostas  

---

**🎉 Implementação completa! O usuário pode agora editar seu perfil clicando no nome na navbar!**
