document.addEventListener("DOMContentLoaded", () => {
    const STUDENT_API_URL = "http://localhost:3000/api/student";
    const PROFESSOR_API_URL = "http://localhost:3000/api/professor";
    const AUTH_API_URL = "http://localhost:3000/api/auth";

    const loginForm = document.getElementById("login-form");
    const professorForm = document.getElementById("teacher-register");

    if (professorForm) {
        professorForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("teacher_name").value.trim();
            const gender = document.getElementById("teacher_gender").value.trim();
            const turn = document.getElementById("teacher_turn").value.trim();
            const email = document.getElementById("teacher_email").value.trim();
            const password = document.getElementById("teacher_password").value.trim();
            const cpf = document.getElementById("teacher_cpf").value.trim();
            const subject = document.getElementById("teacher_subject").value.trim();

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
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();
                console.log("Resposta do servidor (professor):", data);

                if (response.ok) {
                    alert("Professor cadastrado com sucesso!");
                    professorForm.reset();
                    const modal = document.getElementById("modal-professor");
                    if (modal) modal.style.display = "none";
                } else {
                    alert(`Erro: ${data.msg}`);
                }

            } catch (error) {
                console.error("Erro ao enviar a requisição:", error);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }

    const studentForm = document.getElementById("student-register");

    if (studentForm) {
        studentForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("student_name").value.trim();
            const email = document.getElementById("student_email").value.trim();
            const password = document.getElementById("student_password").value.trim();
            const age = document.getElementById("student_age").value.trim();
            const course = document.getElementById("student_course").value.trim();
            const gender = document.getElementById("student_gender").value.trim();
            const turn = document.getElementById("student_turn").value.trim();
            const period = document.getElementById("student_period").value.trim();

            if (!name || !email || !password || !age || !course || !gender || !turn || !period) {
                alert("Preencha todos os campos corretamente!");
                return;
            }

            const requestBody = {
                name,
                email,
                password,
                age,
                course,
                gender,
                turn,
                period
            };

            try {
                const response = await fetch(`${STUDENT_API_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();
                console.log("Resposta do servidor (aluno):", data);

                if (response.ok) {
                    studentForm.reset();
                    const modal = document.getElementById("modal-aluno");
                    if (modal) modal.style.display = "none";
                } else {
                    alert(`Erro: ${data.msg}`);
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
