async function getUserId() {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('userId');

    if (!userIdFromUrl) {
        console.error("ID do usuário não encontrado na URL.");
    }

    const currentUserId = userIdFromUrl;

    return currentUserId;
}

function getReferenceMonth() {
    const storedMonth = localStorage.getItem('referenceMonth');

    if (storedMonth) {
        return JSON.parse(storedMonth);
    }

    return null;
}


async function getReportData(userId, month, year, token) {
    const url = `http://localhost:3000/api/certificates/report/${userId}?month=${month}&year=${year}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const reportData = await response.json();

        if (!response.ok) {
            console.log(reportData.error);
            throw new Error(`Erro ao buscar relatório: ${response.status}`);
        }

        console.log(reportData);
        createReport(reportData);
    } catch (error) {
        console.error(error);
    }
}

const reportContainer = document.querySelector("#report-container");
const exportBtn = document.querySelector("#export-pdf-btn");

function exportReportPDF() {
    const filename = `relatorio_${new Date().toLocaleDateString('pt-BR')}.pdf`;

    const options = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(reportContainer).set(options).save();
}

function createReport(reportData) {
    if (!reportContainer) {
        console.error(`${reportContainer} não foi encontrado!`);
        return;
    }

    reportContainer.innerHTML = '';

    const validCertificates = reportData.certificates.filter(cert => cert.status === 'approved');
    const invalidCertificates = reportData.certificates.filter(cert => cert.status !== 'approved');

    const totalHoursValid = validCertificates.reduce((total, cert) => total + cert.workload, 0);
    const totalHoursInvalid = invalidCertificates.reduce((total, cert) => total + cert.workload, 0);

    const reportContent = `
        <p><strong>Total de Certificados:</strong> ${reportData.totalCertificates}</p>
        <p><strong>Carga Horária Total Válida:</strong> ${totalHoursValid} horas</p>
        <p><strong>Carga Horária Total Inválida:</strong> ${totalHoursInvalid} horas</p>
        
        <h4 class="mt-4">Certificados Válidos</h4>
        <div class="table-responsive">
            <table class="table table-striped table-bordered">
                <thead class="table-success">
                    <tr><th>Título do certificado</th><th>Carga Horária</th><th>Status</th></tr>
                </thead>
                <tbody>
                    ${validCertificates.map(cert => `
                        <tr>
                            <td>${cert.title}</td>
                            <td>${cert.workload}h</td>
                            <td>${certificateBadge(cert.status)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <h4 class="mt-4">Certificados Inválidos</h4>
        <div class="table-responsive">
            <table class="table table-striped table-bordered">
                <thead class="table-danger">
                    <tr><th>Título do certificado</th><th>Carga Horária</th><th>Status</th></tr>
                </thead>
                <tbody>
                    ${invalidCertificates.map(cert => `
                        <tr>
                            <td>${cert.title}</td>
                            <td>${cert.workload}h</td>
                            <td>${certificateBadge(cert.status)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    reportContainer.innerHTML = reportContent;
}

async function initReportData(token) {
    if (!token) {
        console.error("Token de autenticação não encontrado.");
        return;
    }

    const referenceMonth = getReferenceMonth();
    const userId = await getUserId();


    if (referenceMonth && userId) {
        await getReportData(userId, referenceMonth.mesReferencia, referenceMonth.anoReferencia, token);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('authToken');

    if (exportBtn) {
        exportBtn.addEventListener("click", exportReportPDF);
    }

    initReportData(token);
});