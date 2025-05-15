document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('nav-bar');
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const content = document.getElementById('content');
    const collapseIcon = document.querySelector('.collapse-icon');

    sidebarCollapse.addEventListener('click', function(e) {
        e.preventDefault();

        sidebar.classList.toggle('collapsed');
        content.classList.toggle('collapsed');

        collapseIcon.style.transform = sidebar.classList.contains('collapsed') 
            ? 'rotate(180deg)' 
            : 'rotate(0deg)';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const closeModalButtons = document.querySelectorAll('.close-button');
    const modals = document.querySelectorAll('.modal');

    function openModal(modal) {
        if (modal == null) return;
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    function closeModal(modal) {
        if (modal == null) return;
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            openModal(modal);
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });
});


/* Rotas FrontEnd */

document.addEventListener("DOMContentLoaded", () => {
    loadProfessors();
    loadStudents();

    const professorModal = document.getElementById("modal-professor");
    const alunoModal = document.getElementById("modal-aluno");
    const closeProfessorModal = document.querySelectorAll(".close-button");
    const addProfessorButton = document.querySelector('.add-button[data-modal-target="#modal-professor"]');
    const addAlunoButton = document.querySelector('.add-button[data-modal-target="#modal-aluno"]');

    closeProfessorModal.forEach(btn => {
        btn.addEventListener('click', () => {
            if (professorModal) professorModal.style.display = 'none';
            if (alunoModal) alunoModal.style.display = 'none';
        });
    });

    if (addProfessorButton) {
        addProfessorButton.addEventListener('click', () => {
            if (professorModal) professorModal.style.display = 'block';
        });
    }

    if (addAlunoButton) {
        addAlunoButton.addEventListener('click', () => {
            if (alunoModal) alunoModal.style.display = 'block';
        });
    }
});

const STUDENT_API_URL = "http://localhost:3000/api/student";
const PROFESSOR_API_URL = "http://localhost:3000/api/professor";

async function loadProfessors() {
    const teacherTableBody = document.querySelector("#teacher-table tbody");
    teacherTableBody.innerHTML = '<tr><td colspan="6">Carregando professores...</td></tr>';

    try {
        const response = await fetch(PROFESSOR_API_URL);
        if (!response.ok) {
            throw new Error(`Erro ao buscar professores: ${response.status}`);
        }
        const data = await response.json();
        teacherTableBody.innerHTML = '';

        if (data && data.length > 0) {
            data.forEach(professor => {
                const row = teacherTableBody.insertRow();
                row.insertCell().textContent = professor._id;
                row.insertCell().textContent = professor.name;
                row.insertCell().textContent = professor.email;
                row.insertCell().textContent = professor.subjects ? professor.subjects.join(', ') : '';
                row.insertCell().textContent = professor.turn;
                const actionsCell = row.insertCell();
                actionsCell.innerHTML = `
                    <button class="btn btn-sm btn-primary" onclick="openProfessorEditModal('${professor._id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProfessor('${professor._id}')">Remover</button>
                `;
            });
        } else {
            teacherTableBody.innerHTML = '<tr><td colspan="6">Nenhum professor encontrado.</td></tr>';
        }
    } catch (error) {
        console.error('Erro ao carregar professores:', error);
        teacherTableBody.innerHTML = `<tr><td colspan="6">Erro ao carregar professores: ${error.message}</td></tr>`;
    }
}

async function loadStudents() {
    const studentTableBody = document.querySelector("#student-table tbody");
    studentTableBody.innerHTML = '<tr><td colspan="6">Carregando alunos...</td></tr>';

    try {
        const response = await fetch(STUDENT_API_URL);
        if (!response.ok) {
            throw new Error(`Erro ao buscar alunos: ${response.status}`);
        }
        const data = await response.json();
        studentTableBody.innerHTML = '';

        if (data && data.length > 0) {
            data.forEach(student => {
                const row = studentTableBody.insertRow();
                row.insertCell().textContent = student._id;
                row.insertCell().textContent = student.name;
                row.insertCell().textContent = student.email;
                row.insertCell().textContent = student.course;
                row.insertCell().textContent = student.period;
                const actionsCell = row.insertCell();
                actionsCell.innerHTML = `
                    <button class="btn btn-sm btn-primary" onclick="openStudentEditModal('${student._id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student._id}')">Remover</button>
                `;
            });
        } else {
            studentTableBody.innerHTML = '<tr><td colspan="6">Nenhum aluno encontrado.</td></tr>';
        }
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        studentTableBody.innerHTML = `<tr><td colspan="6">Erro ao carregar alunos: ${error.message}</td></tr>`;
    }
}

function openProfessorEditModal(id) {
    alert(`Abrir modal de edição para professor com ID: ${id}`);
}

function deleteProfessor(id) {
    if (confirm(`Tem certeza que deseja remover o professor com ID: ${id}?`)) {
        alert(`Implementação futura para deletar professor com ID: ${id}`);
    }
}

function openStudentEditModal(id) {
    alert(`Abrir modal de edição para aluno com ID: ${id}`);
}

function deleteStudent(id) {
    if (confirm(`Tem certeza que deseja remover o aluno com ID: ${id}?`)) {
        alert(`Implementação futura para deletar aluno com ID: ${id}`);
    }
}