# 🧪 TESTE DA ROTA PUT /api/users/me

## ✅ **Implementação Completa**

A rota `PUT /api/users/me` foi criada com sucesso! Aqui está o que foi implementado:

### **1. Controller Criado**

- `UpdateProfileController.ts` - Controlador específico para edição de perfil
- Validações de dados (email, CPF, senha)
- Tratamento de erros específicos (duplicatas, etc.)
- Retorna dados sem a senha

### **2. Rota Adicionada**

- `PUT /api/users/me` - Rota para usuário logado editar seu próprio perfil
- Autenticação obrigatória (JWT token)
- Autorização para 'admin' e 'participant'

### **3. Campos Editáveis**

- ✅ name (nome completo)
- ✅ email
- ✅ password (nova senha)
- ✅ matricula
- ✅ cpf

---

## 🚀 **Como Usar no Frontend**

### **Exemplo Simples (JavaScript)**

```javascript
const editarPerfil = async (dadosAtualizados) => {
  const token = localStorage.getItem("token"); // ou onde você armazena o token

  try {
    const response = await fetch("http://localhost:3000/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dadosAtualizados),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Perfil atualizado:", data.user);
      alert(data.message); // "Perfil atualizado com sucesso."
      return data.user;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Erro:", error.message);
    alert("Erro: " + error.message);
  }
};

// Exemplo de uso:
editarPerfil({
  name: "João Silva Santos",
  email: "joao.novo@email.com",
});
```

### **Exemplo React (Hook)**

```jsx
import { useState } from "react";

const useEditProfile = () => {
  const [loading, setLoading] = useState(false);

  const editProfile = async (updateData, token) => {
    setLoading(true);
    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  return { editProfile, loading };
};
```

---

## 📋 **Fluxo Recomendado na UI**

1. **Navbar**: Usuário clica no nome/avatar
2. **Menu Dropdown**: Opção "Editar Perfil" ou "Configurações"
3. **Página de Perfil**: Formulário com dados atuais preenchidos
4. **Submit**: Envia apenas campos alterados para `PUT /api/users/me`
5. **Sucesso**: Atualiza dados locais e redireciona ou mostra confirmação

---

## 🔧 **Exemplo de Formulário Simples**

```jsx
import React, { useState, useEffect } from "react";

const EditProfileForm = ({ currentUser, token }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    matricula: "",
    cpf: "",
  });

  // Preencher com dados atuais
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        matricula: currentUser.matricula || "",
        cpf: currentUser.cpf || "",
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparar apenas campos alterados
    const updateData = {};
    if (formData.name !== currentUser.name) updateData.name = formData.name;
    if (formData.email !== currentUser.email) updateData.email = formData.email;
    if (formData.matricula !== currentUser.matricula)
      updateData.matricula = formData.matricula;
    if (formData.cpf !== currentUser.cpf) updateData.cpf = formData.cpf;

    if (Object.keys(updateData).length === 0) {
      alert("Nenhuma alteração foi feita");
      return;
    }

    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Perfil atualizado com sucesso!");
        // Atualizar estado local ou recarregar página
      } else {
        alert("Erro: " + data.error);
      }
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Nome:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label>Matrícula:</label>
        <input
          type="text"
          value={formData.matricula}
          onChange={(e) =>
            setFormData({ ...formData, matricula: e.target.value })
          }
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label>CPF:</label>
        <input
          type="text"
          value={formData.cpf}
          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Salvar Alterações
      </button>
    </form>
  );
};
```

---

## 🎯 **Próximos Passos**

1. ✅ **Backend pronto** - Rota `PUT /api/users/me` funcionando
2. 🔄 **Frontend** - Implementar componente de edição de perfil
3. 🔄 **Navegação** - Adicionar link "Editar Perfil" na navbar
4. 🔄 **Validações** - Adicionar validações visuais no frontend
5. 🔄 **UX** - Feedback visual de sucesso/erro

---

**🎉 A rota PUT /api/users/me está pronta e funcionando! O usuário pode agora editar seu perfil através desta API.**
