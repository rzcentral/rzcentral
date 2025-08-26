document.addEventListener('DOMContentLoaded', () => {

    const currentPath = window.location.pathname.split('/').pop();

    // Lógica para el smooth scroll
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

    // Muestra el modal solo en la página principal y si no se ha visitado
    if ((currentPath === 'index.html' || currentPath === '') && !sessionStorage.getItem('visited')) {
        setTimeout(() => {
            if (modal) {
                modal.style.display = 'flex';
                sessionStorage.setItem('visited', 'true');
            }
        }, 3500); // Espera 3.5 segundos después de que la carga de la página se complete
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
    
    // Si la pantalla de carga y el contenido existen
    if (loaderWrapper && pageContent) {
        // Espera un tiempo mínimo de 3 segundos para el efecto
        setTimeout(() => {
            loaderWrapper.style.opacity = '0';
            setTimeout(() => {
                loaderWrapper.style.display = 'none';
                pageContent.classList.remove('hidden');
                pageContent.style.opacity = '1'; // Asegura la visibilidad
            }, 500); // Coincide con la transición en CSS
        }, 3000);
    }
};
