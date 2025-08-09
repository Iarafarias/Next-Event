const token = localStorage.getItem('authToken');
let currentUserId = null;

async function uploadFile(file, title) {
    const url = "http://localhost:3000/api/certificates/upload";

    const formData = new FormData();
    formData.append("certificate", file);

    existsInFormData(formData, "title", title);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const certificate = await response.json();

        if (!response.ok) {
            createAlert(certificate.error, false);
            throw new Error(`Response status: ${response.status}`);
        }

        if (currentUserId) {
            await loadCertificateCards(currentUserId);
        } else {
            console.error("ID do usuário não disponível para recarregar a lista.");
        }
    } catch (error) {
        console.error(error);
    }
}

function existsInFormData(formData, valFormData, val) {
    if (val) {
        formData.append(`${valFormData}`, val);
    }
}

function certificateCardBody(title, formattedStartDate, formattedEndDate, year, workload, certificateUrl, status) {
    const statusBadge = certificateBadge(status);

    const card = `
        <div class="card-body">
            <div class="d-flex card-container justify-content-between align-items-center">
                <div class="d-flex flex-column gap-3">
                    <div class="d-flex align-items-center gap-3 mb-2">
                        <h3 class="card-title text-left mb-0">${title}</h3>
                        ${statusBadge}
                    </div>
                    <div class="d-flex align-items-center gap-4 calendar-hours-container">
                        <div class="d-flex gap-2 align-items-center">
                            <img src="../pictures/calendar.svg" class="calendar-icon" alt="Data do certificado">
                            <div class="card-sub-text"><span id="date-begin">${formattedStartDate}</span> à
                                <span id="date-end">${formattedEndDate}</span>/<span id="year">${year}</span>
                            </div>
                        </div>

                        <div class="d-flex gap-2 align-items-center">
                            <img src="../pictures/timer.svg" class="calendar-icon" alt="Horas do certificado">
                            <div class="card-sub-text" id="">${workload} horas</div>
                        </div>
                    </div>
                </div>

                <div class="d-flex align-items-center gap-3">
                    <button type="button" class="btn btn-danger remove-certificate-button">Remover</button>

                    <a href="http://localhost:3000${certificateUrl}" target="_blank" download class="btn btn-primary">Baixar arquivo</a>                           
                </div>
            </div>
        </div>
    `;

    return card;
}

const certificatesContainer = document.querySelector("#certificados-container");


function createCertificateCard(certificate) {
    if (!certificate) {
        console.error("Certificado do usuário não disponível!");
        return;
    }

    const certificateCard = document.createElement("div");
    certificateCard.classList.add("card", "shadow-sm");
    certificateCard.dataset.certificateId = certificate.id;

    const startDate = new Date(certificate.startDate);
    const endDate = new Date(certificate.endDate);
    const formattedStartDate = startDate.toLocaleDateString('pt-BR');
    const formattedEndDate = endDate.toLocaleDateString('pt-BR');

    const year = startDate.getFullYear();

    certificateCard.innerHTML = certificateCardBody(certificate.title, formattedStartDate, formattedEndDate, year, certificate.workload, certificate.certificateUrl, certificate.status);

    certificatesContainer.appendChild(certificateCard);

    const removeCertificateButton = certificateCard.querySelector(".remove-certificate-button");

    removeCertificateButton.addEventListener("click", async () => {
        await removeCertificate(certificate.id, certificateCard);
    });
}

async function removeCertificate(certificateId, cardElement) {
    if (!certificateId) {
        console.error("Id do certificado não disponível!");
        return;
    }

    if (!cardElement) {
        console.error("Card não disponível!");
        return;
    }

    const url = `http://localhost:3000/api/certificates/${certificateId}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        cardElement.remove();
    } catch (error) {
        console.error(error);
    }
}

const formCertificate = document.querySelector("#form-certificado");

formCertificate.addEventListener("submit", (event) => {
    event.preventDefault();

    const file = document.querySelector("#upload-certificado").files[0];
    const title = document.querySelector("#titulo-certificado").value;

    if (!file) {
        alert("Faça upload do arquivo do certificado!");
        return;
    }

    uploadFile(file, title);
});

async function loadCertificateCards(userId) {
    if (!userId) {
        console.error("ID do usuário não disponível.");
        return;
    }

    const url = `http://localhost:3000/api/certificates/user/${userId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        certificatesContainer.innerHTML = '';

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const certificates = data.certificates;

        if (Array.isArray(certificates) && certificates.length > 0) {
            certificates.forEach(certificate => {
                createCertificateCard(certificate);
            });
        } else {
            certificatesContainer.innerHTML = "<h3 class='text-danger'>Nenhum certificado encontrado!</h3>";
        }
    } catch (error) {
        console.error(error);
    }
}

async function getUserMeId() {
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
        currentUserId = data.id;
        loadCertificateCards(currentUserId);
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const dataUser = await getUserMeData(token);
    loadUserMeContent(dataUser);
    getUserMeId();
});