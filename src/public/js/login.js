const form = document.querySelector("#user-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const url = "http://localhost:3000/api/users/login";

    try {
        const email = document.querySelector("#usuario-nome").value.trim();
        const password = document.querySelector("#usuario-senha").value.trim();

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();


        if (!response.ok) {
            const error = data.error.toLowerCase();
            let input = null;

            if (error.includes("user") || error.includes("email") || error.includes("e-mail")) {
                input = document.querySelector("#usuario-nome");
            } else if (error.includes("password")) {
                input = document.querySelector("#usuario-senha");
            }

            if (input) {
                const wrapper = input.closest('.label-float');

                if (wrapper) {
                    const label = wrapper.querySelector('label');
                    input.classList.add("border", "border-danger");
                    label.classList.add("text-danger");
                }
            }

            createAlert(data.error, false);

            throw new Error(`Response status: ${response.status}`);
        }

        if (data.token) {
            localStorage.setItem('authToken', data.token);

            if (data.user.role == "participant") {
                window.location.href = '../pages/certificates.html';
            } else {
                window.location.href = '../pages/tutoria.html';
            }
        }
    } catch (error) {
        console.error(error);
    }
});