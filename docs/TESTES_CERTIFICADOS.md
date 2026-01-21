# 🧪 GUIA DE TESTES - SISTEMA DE CERTIFICADOS

## 🎯 **Checklist de Testes**

### **✅ Testes de Upload (Backend)**
- [x] MulterError resolvido
- [x] Foreign key constraint resolvido  
- [x] PDF parsing funcionando
- [x] Validação de período corrigida
- [x] Arquivos sendo salvos corretamente

### **🔄 Testes de Download (Implementar)**

#### **Teste 1: Arquivos Estáticos**
```bash
# Testar se arquivos estáticos estão sendo servidos
curl -I http://localhost:3000/uploads/certificates/1754328687576-certificado.pdf

# Resultado esperado:
# HTTP/1.1 200 OK
# Content-Type: application/pdf
```

#### **Teste 2: Rota de Download Segura**
```bash
# 1. Fazer login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@test.com", "password": "password"}'

# 2. Testar download (substitua TOKEN e CERTIFICATE_ID)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/certificates/CERTIFICATE_ID/download \
  --output test-download.pdf

# 3. Verificar arquivo baixado
file test-download.pdf
# Resultado esperado: test-download.pdf: PDF document
```

#### **Teste 3: Controle de Acesso**
```bash
# Tentar baixar certificado de outro usuário (deve dar erro 403)
curl -H "Authorization: Bearer USER_TOKEN" \
  http://localhost:3000/api/certificates/OTHER_USER_CERTIFICATE_ID/download
```

---

## 🌐 **Testes Front-end**

### **Teste Manual Básico**
1. **Upload de Certificado**
   - Abrir formulário de upload
   - Selecionar arquivo PDF
   - Preencher campos obrigatórios
   - Submeter formulário
   - ✅ Verificar se aparece na lista

2. **Download Direto**
   - Copiar URL do `certificateUrl` de um certificado
   - Abrir em nova aba: `http://localhost:3000/uploads/certificates/filename.pdf`
   - ✅ Deve abrir/baixar o PDF

3. **Download via Botão**
   - Clicar no botão "Baixar PDF"
   - ✅ Deve iniciar download automaticamente
   - ✅ Arquivo deve abrir corretamente

### **Código de Teste JavaScript**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Teste Download Certificados</title>
</head>
<body>
    <h1>Teste de Download de Certificados</h1>
    
    <!-- Teste URL Direta -->
    <div>
        <h2>Teste 1: URL Direta</h2>
        <a href="http://localhost:3000/uploads/certificates/1754328687576-certificado.pdf" 
           target="_blank" download>
            📄 Download Direto
        </a>
    </div>

    <!-- Teste Download Programático -->
    <div>
        <h2>Teste 2: Download Programático</h2>
        <button onclick="testDownload()">📄 Download via JS</button>
    </div>

    <!-- Teste com Autenticação -->
    <div>
        <h2>Teste 3: Download Autenticado</h2>
        <input type="text" id="token" placeholder="JWT Token" style="width: 300px;">
        <input type="text" id="certificateId" placeholder="Certificate ID" style="width: 200px;">
        <button onclick="testSecureDownload()">📄 Download Seguro</button>
    </div>

    <script>
        // Teste básico
        function testDownload() {
            const url = 'http://localhost:3000/uploads/certificates/1754328687576-certificado.pdf';
            const link = document.createElement('a');
            link.href = url;
            link.download = 'test-certificate.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Teste com autenticação
        async function testSecureDownload() {
            const token = document.getElementById('token').value;
            const certificateId = document.getElementById('certificateId').value;
            
            if (!token || !certificateId) {
                alert('Preencha token e certificate ID');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/certificates/${certificateId}/download`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Download failed');
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `certificate-${certificateId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                alert('Download realizado com sucesso!');
            } catch (error) {
                alert('Erro: ' + error.message);
            }
        }
    </script>
</body>
</html>
```

---

## 🚀 **Scripts de Teste Automatizado**

### **test-certificates.js** (Node.js)
```javascript
const axios = require('axios');
const fs = require('fs');

const API_BASE = 'http://localhost:3000';

async function runTests() {
    console.log('🚀 Iniciando testes de certificados...\n');

    // Teste 1: Login
    console.log('1️⃣ Testando login...');
    try {
        const loginResponse = await axios.post(`${API_BASE}/api/users/login`, {
            email: 'user@test.com',
            password: 'password123'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login realizado com sucesso');
        
        // Teste 2: Listar certificados
        console.log('\n2️⃣ Testando listagem de certificados...');
        const listResponse = await axios.get(`${API_BASE}/api/certificates/user/${loginResponse.data.user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const certificates = listResponse.data.certificates || [];
        console.log(`✅ Encontrados ${certificates.length} certificados`);
        
        if (certificates.length > 0) {
            const certificate = certificates[0];
            
            // Teste 3: Download URL direta
            if (certificate.certificateUrl.startsWith('/uploads/')) {
                console.log('\n3️⃣ Testando URL direta...');
                const directUrl = `${API_BASE}${certificate.certificateUrl}`;
                const directResponse = await axios.head(directUrl);
                
                if (directResponse.status === 200) {
                    console.log('✅ URL direta funcionando');
                } else {
                    console.log('❌ URL direta não funcionou');
                }
            }
            
            // Teste 4: Download seguro
            console.log('\n4️⃣ Testando download seguro...');
            const downloadResponse = await axios.get(`${API_BASE}/api/certificates/${certificate.id}/download`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'stream'
            });
            
            if (downloadResponse.status === 200) {
                // Salvar arquivo de teste
                const writer = fs.createWriteStream('test-download.pdf');
                downloadResponse.data.pipe(writer);
                
                writer.on('finish', () => {
                    console.log('✅ Download seguro funcionando - arquivo salvo como test-download.pdf');
                });
            }
        }
        
    } catch (error) {
        console.error('❌ Erro nos testes:', error.response?.data || error.message);
    }
}

// Executar testes
runTests();
```

### **Como executar o teste**
```bash
# Instalar dependência
npm install axios

# Executar teste
node test-certificates.js
```

---

## 📊 **Relatório de Teste Esperado**

### **Sucesso Esperado**
```
🚀 Iniciando testes de certificados...

1️⃣ Testando login...
✅ Login realizado com sucesso

2️⃣ Testando listagem de certificados...
✅ Encontrados 3 certificados

3️⃣ Testando URL direta...
✅ URL direta funcionando

4️⃣ Testando download seguro...
✅ Download seguro funcionando - arquivo salvo como test-download.pdf
```

### **Possíveis Problemas**
```
❌ URL direta não funcionou
   → Verificar se express.static está configurado
   → Verificar se arquivos existem em uploads/

❌ Download seguro falhou
   → Verificar se rota está registrada
   → Verificar autenticação
   → Verificar permissões de arquivo
```

---

## 🔧 **Debugging**

### **Logs do Servidor**
```bash
# Verificar logs em tempo real
tail -f logs/server.log

# Ou no console se rodando com npm start
```

### **Verificar Arquivos**
```bash
# Listar arquivos na pasta uploads
ls -la uploads/certificates/

# Verificar permissões
chmod 644 uploads/certificates/*.pdf
```

### **Verificar Rotas**
```bash
# Testar se servidor está respondendo
curl http://localhost:3000/api/certificates

# Deve retornar: {"message":"Token não fornecido."} (não erro 404)
```

---

## ⚡ **Teste Rápido para o Front-end**

### **Teste Mínimo**
1. Abrir: `http://localhost:3000/uploads/certificates/[arquivo-existente].pdf`
2. ✅ Deve abrir o PDF no navegador

### **Se não funcionar**
1. Verificar se servidor foi reiniciado após as mudanças
2. Verificar se arquivo existe na pasta
3. Verificar console do navegador para erros

### **Comandos de Emergência**
```bash
# Reiniciar servidor
npm run build && npm start

# Verificar se pasta existe
mkdir -p uploads/certificates

# Copiar arquivo de teste
cp uploads/certificates/1754328687576-certificado.pdf uploads/certificates/test.pdf
```

---

**📝 Status Atual**: Todos os testes de backend estão passando. Front-end precisa implementar uma das soluções de download fornecidas nos exemplos.
