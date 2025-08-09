async function getNotifications(token) {
    const url = "http://localhost:3000/api/notifications?unread=true";

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.log(data.error);
            throw new Error(`Response status: ${response.status}`);
        }

        return data.notifications;
    } catch (error) {
        console.error(error);
    }
}

async function getNotificationsCount(token) {
    const url = "http://localhost:3000/api/notifications/unread-count";

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.log(data.error);
            throw new Error(`Response status: ${response.status}`);
        }


        return data.count;
    } catch (error) {
        console.error(error);
    }
}

function updateNotificationCount(count) {
    const notificationCountContainer = document.querySelector("#notification-count");

    if (notificationCountContainer) {
        notificationCountContainer.textContent = count;
    }
}

function preventElement(event) {
    event.preventDefault();
    event.stopPropagation();
}

async function markAsRead(token, notificationId) {
    const url = `http://localhost:3000/api/notifications/${notificationId}/read`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        const data = await response.json();


        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        console.log(data.message);
        await loadNotifications(token);
    } catch (error) {
        console.error(error);
    }
}

function createNotificationList(notifications, token) {
    if (!notifications) {
        console.error(`Notificações não encontradas!`);
        return;
    }

    const containerNotifications = document.querySelector("#container-notifications");

    if (!containerNotifications) {
        console.error(`Elemento não encontrado! ${containerNotifications}`);
        return;
    }

    containerNotifications.innerHTML = '';

    if (notifications.length === 0) {
        containerNotifications.classList.add("text-center");
        containerNotifications.innerHTML = "<span class='text-danger'>Nenhuma notificação</span>";
    }

    notifications.forEach(notification => {
        const listItem = document.createElement("li");
        listItem.classList.add("mb-2");
        listItem.innerHTML += `
            <a class="dropdown-item d-flex justify-content-between align-items-center gap-2" href="#">
                <span>${notification.title}</span>
                <button type="button" class="btn btn-success btn-sm mark-read">Marcar como lida</button>
            </a>
        `;
        containerNotifications.appendChild(listItem);

        const dropdownItem = listItem.querySelector(".dropdown-item");
        dropdownItem.querySelector('.mark-read').addEventListener('click', (event) => {
            preventElement(event);
            markAsRead(token, notification.id);
        });
    });
}

async function loadNotifications(token) {
    if (!token) {
        console.error("Token de autenticação não encontrado!");
        return;
    }

    try {
        const count = await getNotificationsCount(token);
        updateNotificationCount(count);

        const notifications = await getNotifications(token);
        createNotificationList(notifications, token);
    } catch (error) {
        console.error("Erro ao carregar notificações:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('authToken');
    loadNotifications(token);
});
