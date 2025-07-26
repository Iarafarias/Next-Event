function createAlert(content) {
    if (content) {
        alertRemove();

        const alertContainer = document.querySelector("#alert");
        const alert = document.createElement("div");
        alert.classList.add("alert", "alert-danger", "w-100", "text-center");
        alert.setAttribute("role", "alert");
        alert.textContent = content;
        alertContainer.appendChild(alert);
    }
}

function alertRemove() {
    const alertDanger = document.querySelector(".alert-danger");

    if (alertDanger) {
        alertDanger.remove();
    }
}