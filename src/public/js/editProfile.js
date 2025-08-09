async function updateProfile(token) {
    const url = `http://localhost:3000/api/users/me`;

    const name = document.querySelector("#nome").value
    console.log(name);
    
    const email = document.querySelector("#email").value;
    const matricula = document.querySelector("#matricula").value;
    const cpf = document.querySelector("#cpf").value;
    let role = "participant";
    checkAdmin = document.querySelector("#checkAdmin");
    if (checkAdmin && checkAdmin.checked) {
        role = "admin";
    }

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                "name": name,
                "email": email,
                "matricula": matricula,
                "cpf": cpf,
                "role": role
            })
        });

        const data = await response.json();

        if (!response.ok) {
            createAlert(data.error, false);
            throw new Error(`Erro ao buscar relatório: ${response.status}`);
        }

        createAlert("Usuário atualizado", true);
    } catch (error) {
        console.error(error);
    }
}

const formUpdateUser = document.querySelector("#form-atualizar-user");
formUpdateUser.addEventListener("submit", (event) => {
    event.preventDefault();

    const token = localStorage.getItem('authToken');
    updateProfile(token);
});