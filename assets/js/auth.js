document.addEventListener("DOMContentLoaded", () => {

    const loginButton = document.getElementById("loginBtn");

    loginButton.addEventListener("click", () => {

        try {

            authService.getToken();

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error(error);

        }

    });

});
