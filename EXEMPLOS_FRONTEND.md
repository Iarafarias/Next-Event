# 💻 EXEMPLOS PRÁTICOS - INTEGRAÇÃO FRONT-END

## 🚀 **Exemplo Completo: Componente de Download**

### **CertificateDownload.jsx**
```jsx
import React, { useState } from 'react';

const CertificateDownload = ({ certificate, token, onError, onSuccess }) => {
  const [downloading, setDownloading] = useState(false);
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  // Determinar melhor método de download
  const getDownloadStrategy = (cert) => {
    // Certificados novos: URL direta (mais rápido)
    if (cert.certificateUrl?.startsWith('/uploads/')) {
      return {
        type: 'direct',
        url: `${API_BASE_URL}${cert.certificateUrl}`
      };
    }
    // Certificados antigos ou fallback: rota segura
    return {
      type: 'secure',
      url: `${API_BASE_URL}/api/certificates/${cert.id}/download`
    };
  };

  const downloadDirect = (url) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.id}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onSuccess?.();
    } catch (error) {
      console.error('Direct download failed:', error);
      onError?.('Erro no download direto');
    }
  };

  const downloadSecure = async (url) => {
    try {
      setDownloading(true);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const blob = await response.blob();
      
      // Verificar se é realmente um PDF
      if (blob.type !== 'application/pdf') {
        throw new Error('Arquivo recebido não é um PDF');
      }

      const url_blob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url_blob;
      link.download = `certificate-${certificate.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url_blob);
      
      onSuccess?.();
    } catch (error) {
      console.error('Secure download failed:', error);
      onError?.(error.message || 'Erro no download');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownload = async () => {
    const strategy = getDownloadStrategy(certificate);
    
    if (strategy.type === 'direct') {
      downloadDirect(strategy.url);
    } else {
      await downloadSecure(strategy.url);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={downloading}
      className={`
        px-4 py-2 bg-blue-600 text-white rounded-lg 
        hover:bg-blue-700 disabled:opacity-50 
        disabled:cursor-not-allowed flex items-center gap-2
      `}
    >
      {downloading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Baixando...
        </>
      ) : (
        <>
          📄 Baixar PDF
        </>
      )}
    </button>
  );
};

export default CertificateDownload;
```

---

## 📋 **Exemplo: Lista de Certificados com Download**

### **CertificateList.jsx**
```jsx
import React, { useState } from 'react';
import CertificateDownload from './CertificateDownload';

const CertificateList = ({ certificates, token }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownloadSuccess = (certificate) => {
    showNotification(`Certificado "${certificate.title}" baixado com sucesso!`, 'success');
  };

  const handleDownloadError = (certificate, error) => {
    showNotification(`Erro ao baixar "${certificate.title}": ${error}`, 'error');
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: '⏳ Pendente' },
      approved: { color: 'bg-green-100 text-green-800', text: '✅ Aprovado' },
      rejected: { color: 'bg-red-100 text-red-800', text: '❌ Rejeitado' }
    };
    
    const badge = badges[status] || badges.pending;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Notificação */}
      {notification && (
        <div className={`
          p-4 rounded-lg border-l-4 
          ${notification.type === 'success' ? 'bg-green-50 border-green-400 text-green-700' : ''}
          ${notification.type === 'error' ? 'bg-red-50 border-red-400 text-red-700' : ''}
          ${notification.type === 'info' ? 'bg-blue-50 border-blue-400 text-blue-700' : ''}
        `}>
          {notification.message}
        </div>
      )}

      {/* Lista de Certificados */}
      <div className="grid gap-4">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {certificate.title}
                </h3>
                <p className="text-gray-600 mt-1">
                  {certificate.institution}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {certificate.description}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span>⏱️ {certificate.workload}h</span>
                  <span>📅 {new Date(certificate.startDate).toLocaleDateString('pt-BR')} - {new Date(certificate.endDate).toLocaleDateString('pt-BR')}</span>
                  <span>📝 {new Date(certificate.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                {getStatusBadge(certificate.status)}
                
                {/* Só mostrar download para certificados aprovados */}
                {certificate.status === 'approved' && (
                  <CertificateDownload 
                    certificate={certificate}
                    token={token}
                    onSuccess={() => handleDownloadSuccess(certificate)}
                    onError={(error) => handleDownloadError(certificate, error)}
                  />
                )}
              </div>
            </div>

            {/* Comentários do admin (se rejeitado) */}
            {certificate.status === 'rejected' && certificate.adminComments && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700">
                  <strong>Motivo da rejeição:</strong> {certificate.adminComments}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Estado vazio */}
      {certificates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum certificado encontrado
          </h3>
          <p className="text-gray-500">
            Faça upload do seu primeiro certificado para começar
          </p>
        </div>
      )}
    </div>
  );
};

export default CertificateList;
```

---

## 🔧 **Exemplo: Service Completo**

### **certificateService.js**
```javascript
class CertificateService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  }

  // Upload de certificado
  async upload(formData, token) {
    try {
      const response = await fetch(`${this.baseURL}/api/certificates/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // FormData com campo 'certificate'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro no upload');
      }

      return data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  // Listar certificados do usuário
  async getUserCertificates(userId, token) {
    try {
      const response = await fetch(`${this.baseURL}/api/certificates/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar certificados');
      }

      return data.certificates || [];
    } catch (error) {
      console.error('Get certificates error:', error);
      throw error;
    }
  }

  // Download seguro
  async downloadSecure(certificateId, token) {
    try {
      const response = await fetch(`${this.baseURL}/api/certificates/${certificateId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  // Obter URL de download
  getDownloadUrl(certificate) {
    // Certificados novos: URL direta
    if (certificate.certificateUrl?.startsWith('/uploads/')) {
      return {
        type: 'direct',
        url: `${this.baseURL}${certificate.certificateUrl}`,
      };
    }
    
    // Certificados antigos: rota segura
    return {
      type: 'secure',
      url: `${this.baseURL}/api/certificates/${certificate.id}/download`,
    };
  }

  // Utilitário para download automático
  async downloadCertificate(certificate, token) {
    const strategy = this.getDownloadUrl(certificate);
    
    if (strategy.type === 'direct') {
      // Download direto
      window.open(strategy.url, '_blank');
    } else {
      // Download via blob
      const blob = await this.downloadSecure(certificate.id, token);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  }
}

export default new CertificateService();
```

---

## 🧪 **Exemplo: Hook Customizado**

### **useCertificates.js**
```javascript
import { useState, useEffect } from 'react';
import certificateService from '../services/certificateService';

export const useCertificates = (userId, token) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await certificateService.getUserCertificates(userId, token);
      setCertificates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadCertificate = async (formData) => {
    try {
      const newCertificate = await certificateService.upload(formData, token);
      setCertificates(prev => [newCertificate, ...prev]);
      return newCertificate;
    } catch (err) {
      throw err;
    }
  };

  const downloadCertificate = async (certificate) => {
    try {
      await certificateService.downloadCertificate(certificate, token);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (userId && token) {
      loadCertificates();
    }
  }, [userId, token]);

  return {
    certificates,
    loading,
    error,
    uploadCertificate,
    downloadCertificate,
    reload: loadCertificates,
  };
};
```

---

## 📱 **Exemplo: Uso no Componente Principal**

### **CertificatesPage.jsx**
```jsx
import React from 'react';
import { useCertificates } from '../hooks/useCertificates';
import { useAuth } from '../hooks/useAuth';
import CertificateList from '../components/CertificateList';
import CertificateUpload from '../components/CertificateUpload';

const CertificatesPage = () => {
  const { user, token } = useAuth();
  const { 
    certificates, 
    loading, 
    error, 
    uploadCertificate, 
    downloadCertificate,
    reload 
  } = useCertificates(user?.id, token);

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">Erro: {error}</p>
        <button onClick={reload} className="px-4 py-2 bg-blue-600 text-white rounded">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Meus Certificados</h1>
      
      {/* Upload */}
      <div className="mb-8">
        <CertificateUpload 
          onUpload={uploadCertificate}
          onSuccess={() => {
            reload();
            alert('Certificado enviado com sucesso!');
          }}
        />
      </div>

      {/* Lista */}
      <CertificateList 
        certificates={certificates}
        token={token}
      />
    </div>
  );
};

export default CertificatesPage;
```

---

## 🔄 **Migração Gradual**

Se você já tem um sistema funcionando, pode migrar gradualmente:

### **Fase 1: Corrigir Upload**
```javascript
// Apenas trocar 'file' por 'certificate' no FormData
formData.append('certificate', file); // ✅ NOVO
// formData.append('file', file);      // ❌ ANTIGO
```

### **Fase 2: Implementar Download Simples**
```javascript
// Adicionar botão de download básico
const handleDownload = () => {
  window.open(`${API_URL}${certificate.certificateUrl}`, '_blank');
};
```

### **Fase 3: Implementar Download Completo**
```javascript
// Usar os componentes completos acima
```

---

**📝 Nota**: Todos os exemplos assumem que você está usando React. Para Vue, Angular ou JavaScript puro, a lógica é similar, apenas a sintaxe muda.
