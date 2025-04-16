document.addEventListener("DOMContentLoaded", () => {
    const STUDENT_API_URL = "http://localhost:3000/api/student";
    const PROFESSOR_API_URL = "http://localhost:3000/api/professor";
    const AUTH_API_URL = "http://localhost:3000/api/auth";

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const userType = document.querySelector('input[name="user-type"]:checked').value;
            const name = document.getElementById("register-name").value.trim();
            const email = document.getElementById("register-email").value.trim();
            const password = document.getElementById("register-password").value.trim();

            if (!name || !email || !password) {
                alert("Preencha todos os campos!");
                return;
            }

            let requestBody = { name, email, password };
            let apiUrl = "";

            if (userType === "student") {
                const age = document.getElementById("register-age").value.trim();
                const course = document.getElementById("register-course").value.trim();
                const gender = document.getElementById("register-gender").value.trim();
                const period = document.getElementById("register-period").value.trim();

                if (!age || !course || !gender || !period) {
                    alert("Preencha todos os campos!");
                    return;
                }

                requestBody = { ...requestBody, age, course, gender, period };
                apiUrl = `${STUDENT_API_URL}/register`;

            } else if (userType === "professor") {
                const gender = document.getElementById("register-gender").value.trim();
                const turn = document.getElementById("register-turn").value.trim();
                const cpf = document.getElementById("register-cpf").value.trim();
                const subjects = document.getElementById("register-subjects").value.split(",");

                if (!gender || !turn || !cpf || subjects.length === 0) {
                    alert("Preencha todos os campos!");
                    return;
                }

                requestBody = { ...requestBody, gender, turn, cpf, subjects };
                apiUrl = `${PROFESSOR_API_URL}/register`;
            }

            console.log("Enviando registro para:", apiUrl);
            console.log("Dados enviados:", requestBody);

            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();
                console.log("Resposta do servidor:", data);

                if (response.ok) {
                    alert("Cadastro realizado!");
                    registerForm.reset();
                } else {
                    alert(`Erro: ${data.msg}`);
                }
            } catch (error) {
                console.error("Erro ao enviar a requisição:", error);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }

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
});
