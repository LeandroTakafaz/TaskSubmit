document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000/api/auth";

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("register-username").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const password = document.getElementById("register-password").value.trim();

        if (!username || !email || !password) {
            alert("Preencha todos os campos!");
            return;
        }

        console.log("Enviando cadastro...");

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            console.log("Resposta do servidor:", data);

            if (response.ok) {
                alert("Cadastro realizado com sucesso!");
                registerForm.reset();
            } else {
                alert(`Erro: ${data.msg}`);
            }
        } catch (error) {
            console.error("Erro ao enviar a requisição:", error);
            alert("Erro ao conectar com o servidor. Verifique se o backend está rodando.");
        }
    });

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        if (!email || !password) {
            alert("Preencha todos os campos!");
            return;
        }

        console.log("Enviando login...");

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("Resposta do servidor:", data);

            if (response.ok) {
                alert("Login realizado com sucesso!");
                //Fazer a parte de validação do token no back em outro momento
                localStorage.setItem("token", data.token);
                window.location.href = "dashboard.html";
            } else {
                alert(`Erro: ${data.msg}`);
            }
        } catch (error) {
            console.error("Erro ao enviar a requisição:", error);
            alert("Erro ao conectar com o servidor.");
        }
    });
});
