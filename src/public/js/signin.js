// Refatorar funções em arquivo separado para evitar repetição de código

const form = document.querySelector("#form-signin");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const url = "http://localhost:3000/api/users";

    try {
        const name = document.querySelector("#name-input").value.trim();
        const email = document.querySelector("#email-input").value.trim();
        const password = document.querySelector("#pass-input").value;
        const confirmPassword = document.querySelector("#confirm-pass-input").value;
        const matricula = document.querySelector("#matricula-input").value.trim();
        const cpf = document.querySelector("#cpf-input").value.trim();

        if (password !== confirmPassword) {
            alert("As senhas são diferentes!");
            return;
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                matricula,
                cpf
            })
        });
        const data = await response.json();

        if (!response.ok) {
            // Validação de erros do usuário no form de cadastro
            const error = data.error.toLowerCase();
            let input = null;

            if (error.includes("user")) {
                input = document.querySelector(".label-float #name-input");
            } else if (error.includes("email") || error.includes("e-mail")) {
                input = document.querySelector(".label-float #email-input");
            } else if (error.includes("matricula") || error.includes("matrícula")) {
                input = document.querySelector(".label-float #matricula-input");
            } else if (error.includes("cpf")) {
                input = document.querySelector(".label-float #cpf-input");
            } else if (error.includes("password")) {
                input = document.querySelector(".label-float #pass-input");
            }

            if (input) {
                const wrapper = input.closest('.label-float');

                if (wrapper) {
                    const label = wrapper.querySelector('label');
                    input.classList.add("border", "border-danger");
                    label.classList.add("text-danger");
                }
            }

            createAlert(data.error);

            throw new Error(`Response status: ${response.status}`);
        }

        form.reset();
        window.location.href = "/src/public/index.html";
    } catch (error) {
        console.error(error);
    }
});