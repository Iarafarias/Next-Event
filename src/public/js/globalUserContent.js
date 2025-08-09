document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('authToken');
    const userData = await getUserMeData(token);

    loadUserMeContent(userData);
});