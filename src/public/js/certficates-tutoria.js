const token = localStorage.getItem('authToken');
let currentUserId = null;


function certificateCardBody(title, formattedStartDate, formattedEndDate, year, workload, status) {
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
                    <button type="button" class="btn btn-success certificate-success">Aceitar</button>

                    <button type="button" class="btn btn-danger certificate-denied">Negar</button>                           
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

    certificateCard.innerHTML = certificateCardBody(certificate.title, formattedStartDate, formattedEndDate, year, certificate.workload, certificate.status);

    certificatesContainer.appendChild(certificateCard);

    const certficateSuccess = certificateCard.querySelector(".certificate-success");
    certficateSuccess.addEventListener("click", async () => {
        const success = await validateCertificate(certificate.id, "approved", token);
        if (success) {
            updateCardStatus(certificateCard, 'approved');
        }
    });

    const certficateDenied = certificateCard.querySelector(".certificate-denied");
    certficateDenied.addEventListener("click", async () => {
        const rejected = await validateCertificate(certificate.id, "rejected", token);
        if (rejected) {
            updateCardStatus(certificateCard, 'rejected');
        }
    });
}

async function getUserId() {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('userId');

    if (!userIdFromUrl) {
        console.error("ID do usuário não encontrado na URL.");
    }

    const currentUserId = userIdFromUrl;

    await loadUserContent(currentUserId);
    await loadCertificateCards(currentUserId);
}

async function loadUserContent(dataId) {
    if (!dataId) {
        console.error("Id do usuário não informado!");
        return;
    }

    const url = `http://localhost:3000/api/users/${dataId}`;


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
        const userNameSpans = document.querySelectorAll(".user-name-span-title");

        userNameSpans.forEach(span => {
            span.textContent = data.name;
        });

    } catch (error) {
        console.error(error);
    }
}

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

        console.log(certificates);

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

document.addEventListener("DOMContentLoaded", async () => {
    getUserId();
    const dataUser = await getUserMeData(token);
    loadUserMeContent(dataUser);
});