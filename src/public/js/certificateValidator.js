async function validateCertificate(certificateId, status) {
    const url = `http://localhost:3000/api/certificates/${certificateId}/status`;
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "status": status,
                "adminComments": "Validado"
            })
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}


function updateCardStatus(cardElement, status) {
    const badge = cardElement.querySelector('.isApproved');
    if (badge) {
        badge.classList.remove('text-bg-warning', 'text-bg-success', 'text-bg-danger', 'text-bg-secondary');

        if (status === 'approved') {
            badge.textContent = 'Aceito';
            badge.classList.add('text-bg-success');
        } else if (status === 'rejected') {
            badge.textContent = 'Negado';
            badge.classList.add('text-bg-danger');
        }
    }
}

function certificateBadge(status) {
    let badgeContent = "";
    let badgeClass = "badge isApproved";

    switch (status) {
        case 'approved':
            badgeContent = "Aceito";
            badgeClass += " text-bg-success";
            break;
        case 'rejected':
            badgeContent = "Negado";
            badgeClass += " text-bg-danger";
            break;
        default:
            break;
    }

    return `<span class="${badgeClass}">${badgeContent}</span>`;
}

async function validateCertificate(certificateId, status, token) {
    const url = `http://localhost:3000/api/certificates/${certificateId}/status`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "status": status,
                "adminComments": "Validado"
            })
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}