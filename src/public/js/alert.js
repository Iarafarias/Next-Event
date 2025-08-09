function createAlert(content, alertType) {
    if (content) {
        alertRemove();

        const alertContainer = document.querySelector("#alert");
        const alert = document.createElement("div");
        alert.classList.add("alert", "w-100", "text-center");
        alert.setAttribute("role", "alert");

        if (alertType) {
            alert.classList.add("alert-success");
        } else {
            alert.classList.add("alert-danger");
        }

        alert.textContent = content;
        alertContainer.appendChild(alert);
    }
}

function alertRemove() {
    const alert = document.querySelector(".alert");

    if (alert) {
        alert.remove();
    }
}