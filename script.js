document.addEventListener('DOMContentLoaded', () => {
    // Definir la función de validación de la página principal
    const isHomePage = () => ['/', '/index.html'].includes(window.location.pathname);

    // Seleccionar elementos de manera más eficiente
    const elements = {
        navbarLinks: document.querySelectorAll('.navbar-menu a[href^="#"]'),
        modal: document.getElementById('welcome-modal'),
        closeModalBtn: document.querySelector('.close-btn'),
        scrollToTopBtn: document.getElementById('scroll-to-top')
    };

    // Lógica para el smooth scroll
    if (isHomePage()) {
        elements.navbarLinks.forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Lógica del modal de bienvenida
    if (elements.modal && isHomePage() && !sessionStorage.getItem('visited')) {
        elements.modal.style.display = 'flex';
        sessionStorage.setItem('visited', 'true');
    }

    if (elements.closeModalBtn) {
        elements.closeModalBtn.addEventListener('click', () => {
            elements.modal.style.display = 'none';
        });

        elements.modal.addEventListener('click', e => {
            if (e.target === elements.modal) {
                elements.modal.style.display = 'none';
            }
        });
    }

    // Lógica del botón "Scroll to Top"
    if (elements.scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                elements.scrollToTopBtn.classList.add('is-visible');
            } else {
                elements.scrollToTopBtn.classList.remove('is-visible');
            }
        });

        elements.scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Lógica de animaciones al hacer scroll (para las tarjetas, títulos, etc.)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .team-card, .section-title').forEach(element => {
        observer.observe(element);
    });
});
