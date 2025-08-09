const token = localStorage.getItem('authToken');

const saveReferenceMonthForm = document.querySelector("#salvar-data-referencia");
const mesReferencia = document.querySelector("#mes-referencia");
const anoReferencia = document.querySelector("#ano-referencia");

saveReferenceMonthForm.addEventListener("submit", saveReferenceMonth);

function setReferenceMonth() {
    const referenceMonth = {
        mesReferencia: mesReferencia.value,
        anoReferencia: anoReferencia.value
    };

    localStorage.setItem('referenceMonth', JSON.stringify(referenceMonth));
}

async function saveReferenceMonth(e) {
    e.preventDefault();

    const url = "http://localhost:3000/api/certificates/reference-month";


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "month": mesReferencia.value,
                "year": anoReferencia.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const error = data.error.toLowerCase();
            let input = null;
            let label = null;

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

            createAlert(data.error, false);

            throw new Error(`Response status: ${response.status}`);
        }

        createAlert(data.message, true);
        setReferenceMonth();
    } catch (error) {
        console.error(error);
    }
}

async function loadTableContent() {
    const url = "http://localhost:3000/api/users/";

    const tableContetContainer = document.querySelector("#tabela-alunos-conteudo");

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        let tableContent = "";
        let cont = 0;
        let hasParticipants = false;

        for (const user of data) {
            if (user.role.includes("participant")) {
                cont++;
                hasParticipants = true;
                const countCertificate = await certificatesCount(user.id);

                tableContent += `
                    <tr>
                        <th scope="row">${cont}</th>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.matricula}</td>
                        <td>
                            ${countCertificate}
                        </td>
                        <td>
                            <div class="d-flex flex-column justify-content-center gap-3 py-2">
                                <a href="../pages/certificates-tutoria.html?userId=${user.id}"
                                    class="btn btn-primary d-flex justify-content-center align-items-center gap-2 certificados-button">
                                    <i class="fa fa-certificate" aria-hidden="true"></i>
                                    <span>Validar certificados</span>
                                </a>

                                <a href="../pages/relatorio-certificates-tutoria.html?userId=${user.id}"
                                    class="btn btn-primary d-flex justify-content-center align-items-center gap-2 relatorio-btn">
                                    <i class="fa fa-file" aria-hidden="true"></i>
                                    <span>Gerar relatório</span>
                                </a>
                            </div>
                        </td>
                    </tr>
                `;
            }
        }

        if (hasParticipants) {
            tableContetContainer.innerHTML = tableContent;
        } else {
            tableContent = `
                    <tr>
                        <td class="text-center" colspan="6"><h5 class="text-danger">Alunos não encontrados!</h5></td>
                    </tr>
                `;
        }

        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

async function certificatesCount(userId) {
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

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const certificates = data.certificates;

        console.log(certificates);

        return certificates.length;
    } catch (error) {
        console.error(error);
        return 0;
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    const dataUser = await getUserMeData(token);
    loadUserMeContent(dataUser);
    loadTableContent();
});