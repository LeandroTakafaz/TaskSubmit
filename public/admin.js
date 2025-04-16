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