async function getUserMeData(token) {
    const url = "http://localhost:3000/api/users/me";

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

function loadUserMeContent(data) {
    if (!data) {
        console.error("Dados do usuário não disponíveis!");
        return;
    }

    const userName = document.querySelectorAll(".user-name-span");
    const userEmail = document.querySelectorAll(".user-email-span");

    userName.forEach(user => {
        user.textContent = data.name;
    });
    
    userEmail.forEach(user => {
        user.textContent = data.email;
    });
}