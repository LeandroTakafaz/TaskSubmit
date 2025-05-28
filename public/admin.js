async function carregarProfessores() {
    try {
        const response = await fetch("http://localhost:3000/api/professor/");
        const data = await response.json();

        const tbody = document.querySelector(".table tbody");
        tbody.innerHTML = "";

        data.professors.forEach((prof, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${prof.name}</td>
                <td>${prof.email}</td>
                <td>${prof.subjects.join(", ")}</td>
                <td>${prof.turn}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editarProfessor('${prof._id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deletarProfessor('${prof._id}')">Remover</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Erro ao carregar professores:", err);
    }
}

document.addEventListener("DOMContentLoaded", carregarProfessores);


async function deletarProfessor(id) {
    if (!confirm("Tem certeza que deseja remover este professor?")) return;

    try {
        const response = await fetch(`http://localhost:3000/api/professor/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();
        if (response.ok) {
            carregarProfessores();
        } else {
            alert(`Erro: ${data.msg}`);
        }

    } catch (err) {
        console.error("Erro ao deletar professor:", err);
    }
}


async function editarProfessor(id) {
    const updateData = {};

    const novoNome = prompt("Digite o novo nome do professor (ou deixe em branco):");
    if (novoNome) updateData.name = novoNome;

    const novoTurno = prompt("Digite o novo turno (Integral, Noturno, Vespertino) (ou deixe em branco):");
    if (novoTurno) updateData.turn = novoTurno;

    const novasMaterias = prompt("Digite as novas matérias separadas por vírgula (ou deixe em branco):");
    if (novasMaterias) {
        updateData.subjects = novasMaterias.split(",").map(m => m.trim());
    }

    if (Object.keys(updateData).length === 0) {
        alert("Nenhuma informação foi fornecida para atualizar.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/professor/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData)
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.msg);
            carregarProfessores();
        } else {
            alert(`Erro: ${data.msg}`);
        }

    } catch (err) {
        console.error("Erro ao editar professor:", err);
    }
}

async function carregarAlunos() {
    try {
        const response = await fetch("http://localhost:3000/api/student/");
        const data = await response.json();

        const tbody = document.querySelector(".table:nth-of-type(2) tbody");
        tbody.innerHTML = "";

        data.students.forEach((aluno, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${aluno.name}</td>
                <td>${aluno.email}</td>
                <td>${aluno.course}</td>
                <td>${aluno.period}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editarAluno('${aluno._id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deletarAluno('${aluno._id}')">Remover</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Erro ao carregar alunos:", err);
    }
}

async function deletarAluno(id) {
    if (!confirm("Tem certeza que deseja remover este aluno?")) return;

    try {
        const response = await fetch(`http://localhost:3000/api/student/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();
        if (response.ok) {
            carregarAlunos();
        } else {
            alert(`Erro: ${data.msg}`);
        }

    } catch (err) {
        console.error("Erro ao deletar aluno:", err);
    }
}

async function editarAluno(id) {
    const novoNome = prompt("Digite o novo nome do aluno (ou deixe em branco para manter):");
    const novoCurso = prompt("Digite o novo curso (ou deixe em branco para manter):");
    const novoPeriodo = prompt("Digite o novo período (ou deixe em branco para manter):");

    const body = {};

    if (novoNome) body.name = novoNome;
    if (novoCurso) body.course = novoCurso;
    if (novoPeriodo) body.period = novoPeriodo;

    if (Object.keys(body).length === 0) {
        alert("Nenhuma informação fornecida para atualizar.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/student/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.msg);
            carregarAlunos();
        } else {
            alert(`Erro: ${data.msg}`);
        }

    } catch (err) {
        console.error("Erro ao editar aluno:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarAlunos();
});
