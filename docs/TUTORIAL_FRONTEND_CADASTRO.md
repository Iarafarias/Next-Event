# Tutorial: Integração Frontend com React (Cadastro)

Este guia demonstra como integrar o fluxo de cadastro da API **Next-Event** utilizando React Hooks (`useState` e `useEffect`).

---

## 🏗️ 1. Estrutura do Estado e Busca de Cursos

Diferente do JavaScript puro, no React usamos `useState` para armazenar a lista de cursos e o `useEffect` para carregar esses dados assim que o componente for montado.

```jsx
import { useState, useEffect } from 'react';

function Cadastro() {
  const [cursos, setCursos] = useState([]); // Estado para a lista do Select
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cursoId: '',
    matricula: ''
  });

  // Carregar cursos ao montar o componente
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/cursos');
        const data = await response.json(); // IMPORTANTE: use o await aqui!
        
        if (response.ok) {
          setCursos(data);
        }
      } catch (error) {
        console.error("Erro ao buscar cursos:", error);
      }
    };

    fetchCursos();
  }, []);

  // ... (continua abaixo)
}
```

---

## 🎨 2. Renderizando o Select (O erro comum do .map)

Ao renderizar listas no React, lembre-se de:
1.  **Retornar** o elemento (usando `return` ou parênteses `()`).
2.  Usar a propriedade **`key`** única.

```jsx
<select 
  id="cursoId" 
  value={formData.cursoId} 
  onChange={(e) => setFormData({...formData, cursoId: e.target.value})}
>
  <option value="">Selecione um curso</option>
  {cursos.map((curso) => (
    // Note o uso de parênteses ( ) para retorno implícito
    <option key={curso.id} value={curso.id}>
      {curso.nome}
    </option>
  ))}
</select>
```

---

## ⚙️ 3. Enviando o Cadastro (Submissão)

No React, interceptamos o envio do formulário e montamos o objeto conforme a estrutura esperada pela API (com o objeto `aluno` aninhado).

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    nome: formData.nome,
    email: formData.email,
    senha: formData.senha,
    status: "ATIVO",
    aluno: { // A API espera os dados de aluno aninhados aqui
      cursoId: formData.cursoId,
      matricula: formData.matricula
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      alert("Cadastro realizado!");
    } else {
      alert(`Erro: ${result.error}`);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
};
```

---

## 📝 4. Login e Acesso a Roles

Após o login, a API retorna tanto o **token** de acesso quanto um objeto **usuario** que contém a `role` (papel) e os dados de `aluno`.

### Estrutura da Resposta de Login
```json
{
  "usuario": {
    "id": "uuid",
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "student", // Poderia ser: student, tutor, scholarship_holder, coordinator
    "aluno": {
      "matricula": "2026...",
      "role": "ALUNO" // Role interna do perfil Aluno (ALUNO, TUTOR, BOLSISTA)
    }
  },
  "token": "ey..."
}
```

### Exemplo de Captura no React
Você deve salvar essas informações no seu estado global (Context API ou Redux) ou no `localStorage`.

```jsx
const login = async (email, senha) => {
  const response = await fetch('http://localhost:3000/api/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Acessando a role diretamente
    const userRole = data.usuario.role;
    console.log("O papel do usuário é:", userRole);
    
    // Salvando para uso futuro
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.usuario));
    
    // Redirecionar com base na role
    if (userRole === 'coordinator') navigate('/admin');
    else navigate('/dashboard');
  }
};
```

---

## 🚨 Checklist de Erros Frequentes no React

1.  **`await` esquecido**: `const data = response.json()` retorna uma Promessa. Para pegar os dados, você DEVE usar `const data = await response.json()`.
2.  **`map` sem retorno**: Se usar chaves `{ }` no map, você deve escrever `return <option>...`. Sem as chaves, o retorno é automático.
3.  **Estado inicial**: Sempre inicie o estado de listas como um array vazio `useState([])` para evitar que o `.map()` quebre antes dos dados chegarem.
4.  **CORS**: Se o navegador bloquear o acesso, verifique se a URL do seu frontend está permitida no `main.ts` do backend.
