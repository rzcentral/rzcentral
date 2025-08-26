document.addEventListener('DOMContentLoaded', () => {

    const currentPath = window.location.pathname;

    // Lógica para el smooth scroll
    if (currentPath.includes('index.html') || currentPath === '/' || currentPath === '/index.html') {
        document.querySelectorAll('.navbar-menu a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Modal de bienvenida
    const modal = document.getElementById('welcome-modal');
    const closeBtn = document.querySelector('.close-btn');

    // Muestra el modal solo en la página principal y si no se ha visitado
    if ((currentPath.includes('index.html') || currentPath === '/' || currentPath === '/index.html') && !sessionStorage.getItem('visited')) {
        modal.style.display = 'flex';
        sessionStorage.setItem('visited', 'true');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Botón "Scroll to Top"
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
