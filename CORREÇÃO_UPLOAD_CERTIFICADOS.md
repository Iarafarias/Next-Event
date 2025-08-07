# 🔧 CORREÇÃO DO UPLOAD DE CERTIFICADOS

## ❌ **Problema Identificado**

O erro que você estava recebendo:
```json
{
    "error": "Failed to process certificate: Failed to process PDF: ENOENT: no such file or directory, open '/uploads/certificates/1754577057405-certificado.pdf'"
}
```

**Causa**: O `StorageService` retornava um caminho URL (`/uploads/certificates/file.pdf`) mas o `PDFProcessorService` tentava ler o arquivo usando esse caminho como se fosse um caminho físico do sistema.

---

## ✅ **Solução Implementada**

### **1. Adicionado método `getPhysicalPath()` no StorageService**
```typescript
// Método para obter o caminho físico real do arquivo
getPhysicalPath(urlPath: string): string {
  // Remove '/uploads/certificates/' do início e retorna caminho físico
  const fileName = urlPath.replace('/uploads/certificates/', '');
  return path.join(this.uploadDir, fileName);
}
```

### **2. Corrigido UploadCertificateUseCase**
```typescript
if (!workload) {
  // Usar caminho físico para processar o PDF
  const physicalPath = this.storageService.getPhysicalPath(filePath);
  pdfInfo = await this.pdfProcessor.extractInformation(physicalPath);
  workload = pdfInfo.workload;
}
```

### **3. Corrigido CreateCertificateUseCase**
```typescript
async execute(data: CreateCertificateDTO): Promise<Certificate> {
  const filePath = await this.storageService.uploadFile(data.file);
  // Usar caminho físico para processar o PDF
  const physicalPath = this.storageService.getPhysicalPath(filePath);
  const { workload, month, year } = await this.pdfProcessor.extractInformation(physicalPath);
}
```

---

## 🧪 **Teste no Insomnia**

Adicione este teste ao seu arquivo do Insomnia:

```yaml
- url: http://localhost:3000/api/certificates/upload
  name: Upload-Certificate-FIXED
  method: POST
  body:
    mimeType: multipart/form-data
    params:
      - name: certificate
        value: ""
        description: "Selecione um arquivo PDF do certificado"
        type: file
  headers:
    - name: Authorization
      value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImlhcmFAZW1haWwuY29tIiwibWF0cmljdWxhIjoiMTIzNDU2IiwiaWF0IjoxNzUxNzYzOTU1LCJleHAiOjE3NTE3Njc1NTV9.qUHdyIZ9_dPKZ96eLYPcge_g3MLmSPBOVvzn6ix4sZI
    - name: User-Agent
      value: insomnia/11.1.0
```

---

## 🔍 **Como Testar**

### **1. Preparar Ambiente**
```bash
# 1. Certifique-se que o servidor está rodando
npm run dev

# 2. Verifique se a pasta uploads existe
# O sistema criará automaticamente: uploads/certificates/
```

### **2. Testar Upload**
1. Abra o Insomnia
2. Use o teste "Upload-Certificate-FIXED" 
3. Selecione um arquivo PDF
4. Adicione token JWT válido no header Authorization
5. Envie a requisição

### **3. Resultado Esperado**
```json
{
  "message": "Certificate uploaded successfully",
  "certificate": {
    "id": "uuid-do-certificado",
    "title": "nome-do-arquivo.pdf",
    "workload": 40,
    "startDate": "2025-03-01T00:00:00.000Z",
    "endDate": "2025-07-31T23:59:59.999Z",
    "certificateUrl": "/uploads/certificates/1754577057405-certificado.pdf",
    "status": "pending"
  }
}
```

---

## 🐛 **Debug Adicional**

Se ainda houver problemas, verifique:

### **1. Logs do Servidor**
O PDFProcessor agora mostra logs detalhados:
```
PDF Text extracted: [conteúdo do PDF]
Extracted info: { startMonth: 3, endMonth: 7, year: 2025, workload: 40 }
```

### **2. Estrutura de Pastas**
```
NextEvent/
├── uploads/
│   └── certificates/
│       └── 1754577057405-certificado.pdf
```

### **3. Verificar Permissões**
```bash
# No Windows/GitBash:
ls -la uploads/certificates/

# Deve mostrar os arquivos PDF salvos
```

---

## 🎯 **Fluxo Corrigido**

1. **Upload**: Multer salva arquivo temporário
2. **Storage**: Move para `uploads/certificates/` e retorna URL `/uploads/certificates/file.pdf`
3. **PDF Processing**: Converte URL para caminho físico `uploads/certificates/file.pdf`
4. **Leitura**: Lê arquivo do caminho físico correto
5. **Extração**: Processa texto e extrai informações
6. **Database**: Salva certificado com dados extraídos

---

## 🚀 **Status**

✅ **CORREÇÃO APLICADA** - O upload de certificados deve funcionar agora!  
✅ **Servidor rodando** na porta 3000  
✅ **Logs habilitados** para debug  
✅ **Caminhos corrigidos** para processamento de PDF  

**🎉 Teste agora e deve funcionar perfeitamente!**
