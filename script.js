document.addEventListener('DOMContentLoaded', () => {

    // Lógica para el smooth scroll
    const currentPath = window.location.pathname.split('/').pop();
    if (currentPath === 'index.html' || currentPath === '') {
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
    if ((currentPath === 'index.html' || currentPath === '') && !sessionStorage.getItem('visited')) {
        setTimeout(() => {
            if (modal) {
                modal.style.display = 'flex';
                sessionStorage.setItem('visited', 'true');
            }
        }, 3500);
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
    if (scrollToTopBtn) {
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
    }
});


// Lógica para ocultar el loader y mostrar el contenido
window.onload = function() {
    const loaderWrapper = document.getElementById('loader-wrapper');
    const pageContent = document.getElementById('page-content');
    
    if (loaderWrapper && pageContent) {
        // Establece el tiempo de carga simulado
        setTimeout(() => {
            // Inicia la transición de opacidad del loader
            loaderWrapper.style.opacity = '0'; 
            // Espera a que el loader se desvanezca
            setTimeout(() => {
                loaderWrapper.style.display = 'none';
                pageContent.style.display = 'block'; 
                setTimeout(() => {
                    pageContent.classList.add('visible');
                }, 50); // Pequeño retraso para asegurar la animación
            }, 500); // Coincide con la duración de la transición en CSS
        }, 3000); // 3 segundos de carga
    }
};
