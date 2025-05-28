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

const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.modal .close-button');
const addProfessorButton = document.querySelector('[data-modal-target="#modal-professor"]');
const addStudentButton = document.querySelector('[data-modal-target="#modal-aluno"]');

addProfessorButton.addEventListener('click', () => {
    document.getElementById('modal-professor').style.display = 'block';
});

addStudentButton.addEventListener('click', () => {
    document.getElementById('modal-aluno').style.display = 'block';
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

async function loadProfessors() {
    try {
        const response = await fetch('/api/professor');
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        const data = await response.json();
        const professors = data.professors;

        const professorsTableBody = document.querySelector('#content table:nth-of-type(1) tbody');
        professorsTableBody.innerHTML = '';

        if (professors.length === 0) {
            professorsTableBody.innerHTML = '<tr><td colspan="6">Nenhum professor cadastrado.</td></tr>';
            return;
        }

        professors.forEach((professor, index) => {
            const row = `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${professor.name}</td>
                    <td>${professor.email}</td>
                    <td>${professor.subjects.join(', ')}</td>
                    <td>${professor.turn}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="openEditProfessorModal('${professor._id}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProfessor('${professor._id}')">Remover</button>
                    </td>
                </tr>
            `;
            professorsTableBody.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        console.error('Erro ao carregar professores:', error);
        const professorsTableBody = document.querySelector('#content table:nth-of-type(1) tbody');
        professorsTableBody.innerHTML = '<tr><td colspan="6" class="text-danger">Erro ao carregar professores.</td></tr>';
    }
}

async function loadStudents() {
    try {
        const response = await fetch('/api/student');
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        const data = await response.json();
        const students = data.students;

        const studentsTableBody = document.querySelector('#content table:nth-of-type(2) tbody');
        studentsTableBody.innerHTML = '';

        if (students.length === 0) {
            studentsTableBody.innerHTML = '<tr><td colspan="6">Nenhum aluno cadastrado.</td></tr>';
            return;
        }

        students.forEach((student, index) => {
            const row = `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.course}</td>
                    <td>${student.period}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="openEditStudentModal('${student._id}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student._id}')">Remover</button>
                    </td>
                </tr>
            `;
            studentsTableBody.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        const studentsTableBody = document.querySelector('#content table:nth-of-type(2) tbody');
        studentsTableBody.innerHTML = '<tr><td colspan="6" class="text-danger">Erro ao carregar alunos.</td></tr>';
    }
}

async function openEditProfessorModal(professorId) {
    try {
        const response = await fetch(`/api/professor/${professorId}`);
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        const professor = await response.json();

        document.getElementById('edit_teacher_id').value = professor._id;
        document.getElementById('edit_teacher_name').value = professor.name;
        document.getElementById('edit_teacher_gender').value = professor.gender;
        document.getElementById('edit_teacher_turn').value = professor.turn;
        document.getElementById('edit_teacher_email').value = professor.email;
        document.getElementById('edit_teacher_cpf').value = professor.cpf;
        document.getElementById('edit_teacher_subject').value = professor.subjects ? professor.subjects.join(', ') : '';

        document.getElementById('modal-editar-professor').style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar dados do professor para edição:', error);
        alert('Não foi possível carregar os dados do professor para edição.');
    }
}

async function deleteProfessor(professorId) {
    if (!confirm('Tem certeza que deseja remover este professor?')) {
        return;
    }

    try {
        const response = await fetch(`/api/professor/${professorId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || `Erro HTTP! status: ${response.status}`);
        }
        const data = await response.json();
        alert(data.msg || 'Professor removido com sucesso!');
        loadProfessors();
    } catch (error) {
        console.error('Erro ao remover professor:', error);
        alert('Erro ao remover professor: ' + error.message);
    }
}

async function openEditStudentModal(studentId) {
    try {
        const response = await fetch(`/api/student/${studentId}`);
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        const student = await response.json();

        document.getElementById('edit_student_id').value = student._id;
        document.getElementById('edit_student_name').value = student.name;
        document.getElementById('edit_student_email').value = student.email;
        document.getElementById('edit_student_age').value = student.age;
        document.getElementById('edit_student_course').value = student.course;
        document.getElementById('edit_student_gender').value = student.gender;
        document.getElementById('edit_student_turn').value = student.turn;
        document.getElementById('edit_student_period').value = student.period;

        document.getElementById('modal-editar-aluno').style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar dados do aluno para edição:', error);
        alert('Não foi possível carregar os dados do aluno para edição.');
    }
}

async function deleteStudent(studentId) {
    if (!confirm('Tem certeza que deseja remover este aluno?')) {
        return;
    }

    try {
        const response = await fetch(`/api/student/${studentId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || `Erro HTTP! status: ${response.status}`);
        }
        const data = await response.json();
        alert(data.msg || 'Aluno removido com sucesso!');
        loadStudents();
    } catch (error) {
        console.error('Erro ao remover aluno:', error);
        alert('Erro ao remover aluno: ' + error.message);
    }
}

const teacherRegisterForm = document.getElementById('teacher-register');
if (teacherRegisterForm) {
    teacherRegisterForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(teacherRegisterForm);
        const data = {
            name: formData.get('teacher_name'),
            gender: formData.get('teacher_gender'),
            turn: formData.get('teacher_turn'),
            email: formData.get('teacher_email'),
            password: formData.get('teacher_password'),
            cpf: formData.get('teacher_cpf'),
            subjects: formData.get('teacher_subject').split(',').map(s => s.trim()).filter(s => s !== '')
        };

        try {
            const response = await fetch('/api/professor/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Erro ao cadastrar professor.');
            }

            alert('Professor cadastrado com sucesso!');
            teacherRegisterForm.reset();
            document.getElementById('modal-professor').style.display = 'none';
            loadProfessors();
        } catch (error) {
            console.error('Erro ao cadastrar professor:', error);
            alert('Erro ao cadastrar professor: ' + error.message);
        }
    });
}

const teacherEditForm = document.getElementById('teacher-edit');
if (teacherEditForm) {
    teacherEditForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const professorId = document.getElementById('edit_teacher_id').value;
        const formData = new FormData(teacherEditForm);
        const data = {
            name: formData.get('edit_teacher_name'),
            gender: formData.get('edit_teacher_gender'),
            turn: formData.get('edit_teacher_turn'),
            email: formData.get('edit_teacher_email'),
            cpf: formData.get('edit_teacher_cpf'),
            subjects: formData.get('edit_teacher_subject').split(',').map(s => s.trim()).filter(s => s !== '')
        };

        try {
            const response = await fetch(`/api/professor/${professorId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Erro ao atualizar professor.');
            }

            alert('Professor atualizado com sucesso!');
            document.getElementById('modal-editar-professor').style.display = 'none';
            loadProfessors();
        } catch (error) {
            console.error('Erro ao atualizar professor:', error);
            alert('Erro ao atualizar professor: ' + error.message);
        }
    });
}

const studentRegisterForm = document.getElementById('student-register');
if (studentRegisterForm) {
    studentRegisterForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(studentRegisterForm);
        const data = {
            name: formData.get('student_name'),
            email: formData.get('student_email'),
            password: formData.get('student_password'),
            age: formData.get('student_age'),
            course: formData.get('student_course'),
            gender: formData.get('student_gender'),
            turn: formData.get('student_turn'),
            period: formData.get('student_period')
        };

        try {
            const response = await fetch('/api/student/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Erro ao cadastrar aluno.');
            }

            alert('Aluno cadastrado com sucesso!');
            studentRegisterForm.reset();
            document.getElementById('modal-aluno').style.display = 'none';
            loadStudents();
        } catch (error) {
            console.error('Erro ao cadastrar aluno:', error);
            alert('Erro ao cadastrar aluno: ' + error.message);
        }
    });
}

const studentEditForm = document.getElementById('student-edit');
if (studentEditForm) {
    studentEditForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const studentId = document.getElementById('edit_student_id').value;
        const formData = new FormData(studentEditForm);
        const data = {
            name: formData.get('edit_student_name'),
            email: formData.get('edit_student_email'),
            age: formData.get('edit_student_age'),
            course: formData.get('edit_student_course'),
            gender: formData.get('edit_student_gender'),
            turn: formData.get('edit_student_turn'),
            period: formData.get('edit_student_period')
        };

        try {
            const response = await fetch(`/api/student/${studentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
                        
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Erro ao atualizar aluno.');
            }

            alert('Aluno atualizado com sucesso!');
            document.getElementById('modal-editar-aluno').style.display = 'none';
            loadStudents();
        } catch (error) {
            console.error('Erro ao atualizar aluno:', error);
            alert('Erro ao atualizar aluno: ' + error.message);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadProfessors();
    loadStudents();
}); 