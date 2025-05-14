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

document.addEventListener('DOMContentLoaded', () => {
    loadProfessors();
    loadStudents();

    const professorAddButton = document.querySelector('[data-modal-target="#modal-professor"]');
    const studentAddButton = document.querySelector('[data-modal-target="#modal-aluno"]');
    const closeButtons = document.querySelectorAll('.close-button');
    const modalProfessor = document.getElementById('modal-professor');
    const modalAluno = document.getElementById('modal-aluno');
    const teacherForm = document.getElementById('teacher-register');
    const studentForm = document.getElementById('student-register');
    const modalEditarProfessor = document.getElementById('modal-editar-professor');
    const modalEditarAluno = document.getElementById('modal-editar-aluno');
    const teacherEditForm = document.getElementById('teacher-edit');
    const studentEditForm = document.getElementById('student-edit');

    professorAddButton?.addEventListener('click', () => openModal(modalProfessor));
    studentAddButton?.addEventListener('click', () => openModal(modalAluno));

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    document.querySelectorAll('#modal-editar-professor .close-button').forEach(button => {
        button.addEventListener('click', () => closeEditModal(modalEditarProfessor));
    });

    document.querySelectorAll('#modal-editar-aluno .close-button').forEach(button => {
        button.addEventListener('click', () => closeEditModal(modalEditarAluno));
    });

    teacherForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(teacherForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/professores/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.msg);
                closeModal(modalProfessor);
                loadProfessors();
                teacherForm.reset();
            } else {
                alert(result.msg || 'Erro ao cadastrar professor.');
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            alert('Erro ao enviar formulário.');
        }
    });

    studentForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(studentForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/alunos/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.msg);
                closeModal(modalAluno);
                loadStudents();
                studentForm.reset();
            } else {
                alert(result.msg || 'Erro ao cadastrar aluno.');
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            alert('Erro ao enviar formulário.');
        }
    });

    teacherEditForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(teacherEditForm);
        const data = Object.fromEntries(formData.entries());
        const teacherId = document.getElementById('edit_teacher_id').value;

        try {
            const response = await fetch(`/api/professores/${teacherId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.msg);
                closeEditModal(modalEditarProfessor);
                loadProfessors();
                teacherEditForm.reset();
            } else {
                alert(result.msg || 'Erro ao atualizar professor.');
            }
        } catch (error) {
            console.error('Erro ao enviar formulário de edição:', error);
            alert('Erro ao enviar formulário de edição.');
        }
    });

    studentEditForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(studentEditForm);
        const data = Object.fromEntries(formData.entries());
        const studentId = document.getElementById('edit_student_id').value;

        try {
            const response = await fetch(`/api/alunos/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.msg);
                closeEditModal(modalEditarAluno);
                loadStudents();
                studentEditForm.reset();
            } else {
                alert(result.msg || 'Erro ao atualizar aluno.');
            }
        } catch (error) {
            console.error('Erro ao enviar formulário de edição:', error);
            alert('Erro ao enviar formulário de edição.');
        }
    });
});

function openModal(modal) {
    if (modal == null) return;
    modal.style.display = 'block';
}

function closeModal(modal) {
    if (modal == null) return;
    modal.style.display = 'none';
}

function openEditModal(modal) {
    if (modal == null) return;
    modal.style.display = 'block';
}

function closeEditModal(modal) {
    if (modal == null) return;
    modal.style.display = 'none';
}

async function loadProfessors() {
    const professorTableBody = document.querySelector('#content table:first-of-type tbody');
    professorTableBody.innerHTML = '<tr><td colSpan="6">Carregando professores...</td></tr>';
    try {
        const response = await fetch('/api/professores');
        const data = await response.json();
        professorTableBody.innerHTML = '';
        data.professors.forEach(professor => {
            const row = professorTableBody.insertRow();
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
    } catch (error) {
        console.error('Erro ao carregar professores:', error);
        professorTableBody.innerHTML = '<tr><td colSpan="6">Erro ao carregar professores.</td></tr>';
    }
}

async function loadStudents() {
    const studentTableBody = document.querySelector('#content table:last-of-type tbody');
    studentTableBody.innerHTML = '<tr><td colSpan="6">Carregando alunos...</td></tr>';
    try {
        const response = await fetch('/api/alunos');
        const data = await response.json();
        studentTableBody.innerHTML = '';
        data.students.forEach(student => {
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
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        studentTableBody.innerHTML = '<tr><td colSpan="6">Erro ao carregar alunos.</td></tr>';
    }
}

async function openProfessorEditModal(id) {
    const modal = document.getElementById('modal-editar-professor');
    const nameInput = document.getElementById('edit_teacher_name');
    const emailInput = document.getElementById('edit_teacher_email');
    const genderSelect = document.getElementById('edit_teacher_gender');
    const turnSelect = document.getElementById('edit_teacher_turn');
    const cpfInput = document.getElementById('edit_teacher_cpf');
    const subjectInput = document.getElementById('edit_teacher_subject');
    const idInput = document.getElementById('edit_teacher_id');

    try {
        const response = await fetch(`/api/professores/${id}`);
        const professorData = await response.json();
        if (response.ok) {
            nameInput.value = professorData.name;
            emailInput.value = professorData.email;
            genderSelect.value = professorData.gender;
            turnSelect.value = professorData.turn;
            cpfInput.value = professorData.cpf;
            subjectInput.value = professorData.subjects ? professorData.subjects.join(', ') : '';
            idInput.value = professorData._id;
            openEditModal(modal);
        } else {
            alert('Erro ao buscar dados do professor para edição.');
        }
    } catch (error) {
        console.error('Erro ao buscar dados do professor:', error);
        alert('Erro ao buscar dados do professor.');
    }
}

async function openStudentEditModal(id) {
    const modal = document.getElementById('modal-editar-aluno');
    const nameInput = document.getElementById('edit_student_name');
    const emailInput = document.getElementById('edit_student_email');
    const ageInput = document.getElementById('edit_student_age');
    const courseInput = document.getElementById('edit_student_course');
    const genderSelect = document.getElementById('edit_student_gender');
    const turnSelect = document.getElementById('edit_student_turn');
    const periodInput = document.getElementById('edit_student_period');
    const idInput = document.getElementById('edit_student_id');

    try {
        const response = await fetch(`/api/alunos/${id}`);
        const studentData = await response.json();
        if (response.ok) {
            nameInput.value = studentData.name;
            emailInput.value = studentData.email;
            ageInput.value = studentData.age;
            courseInput.value = studentData.course;
            genderSelect.value = studentData.gender;
            turnSelect.value = studentData.turn;
            periodInput.value = studentData.period;
            idInput.value = studentData._id;
            openEditModal(modal);
        } else {
            alert('Erro ao buscar dados do aluno para edição.');
        }
    } catch (error) {
        console.error('Erro ao buscar dados do aluno:', error);
        alert('Erro ao buscar dados do aluno.');
    }
}

async function deleteProfessor(id) {
    if (confirm('Tem certeza que deseja remover este professor?')) {
        try {
            const response = await fetch(`/api/professores/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.msg);
                loadProfessors();
            } else {
                alert(result.msg || 'Erro ao remover professor.');
            }
        } catch (error) {
            console.error('Erro ao remover professor:', error);
            alert('Erro ao remover professor.');
        }
    }
}

async function deleteStudent(id) {
    if (confirm('Tem certeza que deseja remover este aluno?')) {
        try {
            const response = await fetch(`/api/alunos/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.msg);
                loadStudents();
            } else {
                alert(result.msg || 'Erro ao remover aluno.');
            }
        } catch (error) {
            console.error('Erro ao remover aluno:', error);
            alert('Erro ao remover aluno.');
        }
    }
}

function editProfessor(id) {
    console.log(`Editar professor com ID: ${id}`);
}

function editStudent(id) {
    console.log(`Editar aluno com ID: ${id}`);
}