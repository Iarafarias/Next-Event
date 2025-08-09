const navbar = document.querySelector(".navbar");

function createNavbar(userData) {
    const navbar = document.querySelector(".navbar");

    const notificationsNav = `
        <div class="btn-group">
            <button type="button" class="btn btn-primary position-relative dropdown-toggle"
                data-bs-toggle="dropdown">
                <i class="fa fa-bell" aria-hidden="true"></i>
                <span
                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    <span class="notification-count" id="notification-count"></span>
                    <span class="visually-hidden">não lidas</span>
                </span>
            </button>
            <ul class="dropdown-menu" id="container-notifications">
                <li>
                    <a class="dropdown-item" href="#btnJulho">
                        <div class="d-flex align-items-center text-danger gap-1 certificate-notification"
                            id="certificate-notification-error">
                            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                            <span>Período incorreto em Julho</span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>
    `;

    const isAdmin = (userData.role === "admin");

    const navLink = isAdmin ?
        `<a class="nav-link" href="./tutoria.html">Tutoria</a>` :
        `<a class="nav-link" href="./certificates.html">Certificados</a>`;

    const notificationListItem = !isAdmin ?
        notificationsNav : '';

    const navbarContent = `
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <img src="../pictures/NextCertify.png" alt="NextCertify">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav ms-auto gap-3 d-flex align-items-center">
                    <li class="nav-item">
                        ${notificationListItem}
                    </li>

                    <li class="nav-item">
                        ${navLink}
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="./contact.html">Contato</a>
                    </li>

                    <li class="nav-item">
                        <a class="d-flex align-items-center gap-2 user-link text-decoration-none"
                            href="../pages/editar-perfil.html">
                            <i class="fa fa-user-circle" aria-hidden="true" style="font-size: 2rem;"></i>
                            <span class="user-name-span nav-user-name" id="nav-user-name">Ícaro</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    `;

    navbar.innerHTML = navbarContent;
}

function notUserNavbar(token) {
    if (!token) {
        navbar.innerHTML = `
            <div class="container-fluid">
                <a class="navbar-brand" href="#">
                    <img src="../pictures/NextCertify.png" alt="NextCertify">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav ms-auto gap-3 d-flex align-items-center">
                        <li class="nav-item">
                            <a class="nav-link" href="./contact.html">Contato</a>
                        </li>

                        <li class="nav-item">
                            <a class="d-flex align-items-center gap-2 user-link text-decoration-none"
                                href="../pages/index.html">
                                Entrar
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        `
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('authToken');
    const userData = await getUserMeData(token);

    createNavbar(userData);
    notUserNavbar(userData);
});