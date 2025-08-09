function errorMessage(data, route) {
    const error = data.error.toLowerCase();
    let input = null;
    let label = null;

    if (route.includes(apiRoutes.certificateMonth)) {
        if (error.includes("month")) {
            input = mesReferencia;
            label = document.querySelector(`label[for="mes-referencia"]`);
        } else if (error.includes("year")) {
            input = anoReferencia;
            label = document.querySelector(`label[for="ano-referencia"]`);
        }

        if (input) {
            input.classList.add("border", "border-danger");

            if (label) {
                label.classList.add("text-danger");
            }
        }

        createAlert(data.error);
    }

    if (route.includes(apiRoutes.user)) {
        if (route == apiRoutes.userLogin) {
            if (error.includes("user") || error.includes("email") || error.includes("e-mail")) {
                input = document.querySelector("#usuario-nome");
            } else if (error.includes("password")) {
                input = document.querySelector("#usuario-senha");
            }
        }
        else if (route == apiRoutes.user) {
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
    }
}