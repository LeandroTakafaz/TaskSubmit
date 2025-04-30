document.addEventListener("DOMContentLoaded", () => {
    const STUDENT_API_URL = "http://localhost:3000/api/student";
    const PROFESSOR_API_URL = "http://localhost:3000/api/professor";
    const AUTH_API_URL = "http://localhost:3000/api/auth";

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const gender = document.getElementById("gender").value.trim();
            const turn = document.getElementById("turn").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const cpf = document.getElementById("cpf").value.trim();
            const subject = document.getElementById("subject").value.trim();

            if (!name || !gender || !turn || !email || !password || !cpf || !subject) {
                alert("Preencha todos os campos corretamente!");
                return;
            }

            const requestBody = {
                name,
                gender,
                turn,
                email,
                password,
                cpf,
                subjects: subject.split(",").map(s => s.trim())
            };

            try {
                const response = await fetch(`${PROFESSOR_API_URL}/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();
                console.log("Resposta do servidor:", data);

                if (response.ok) {
                    registerForm.reset();
                }

            } catch (error) {
                console.error("Erro ao enviar a requisição:", error);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            if (!email || !password) {
                alert("Preencha todos os campos!");
                return;
            }

            try {
                const response = await fetch(`${AUTH_API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                console.log("Resposta do servidor:", data);

                if (response.ok) {
                    localStorage.setItem("token", data.token);

                    if (data.user.role === "student") {
                        window.location.href = "./TelaDeAula/tela.html";
                    } else if (data.user.role === "professor") {
                        window.location.href = "./TelaDeProfessor/tela.html";
                    }
                } else {
                    alert(`Erro: ${data.msg}`);
                }
            } catch (error) {
                console.error("Erro ao enviar a requisição:", error);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }
});
