document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('nav-bar');
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const content = document.getElementById('content');
    const collapseIcon = document.querySelector('.collapse-icon');

    sidebarCollapse.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Alterna as classes para animação
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('collapsed');
        
        // Animação adicional no ícone (opcional)
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
        document.body.classList.add('modal-open'); // Opcional: para desabilitar o scroll do fundo
    }

    function closeModal(modal) {
        if (modal == null) return;
        modal.style.display = 'none';
        document.body.classList.remove('modal-open'); // Opcional: reabilita o scroll do fundo
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