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

    // Lógica para la detección de VPN
    // API pública y gratuita que no requiere key
    const VPN_DETECTION_API_URL = 'http://ip-api.com/json/?fields=hosting,as';

    async function checkVPNAndLoadContent() {
        try {
            const response = await fetch(VPN_DETECTION_API_URL);
            const data = await response.json();

            // La API de ip-api.com tiene un campo 'hosting' que puede ser true para VPNs.
            // También se puede verificar el campo 'as' (Autonomous System) para detectar centros de datos.
            if (data.hosting === true || (data.as && data.as.includes('datacenter'))) {
                // Bloquear la carga de la página y mostrar un mensaje
                document.body.innerHTML = '<h1>Acceso Denegado</h1><p>Detectamos que estás usando una VPN o un proxy. Por favor, desactívalo para continuar.</p>';
                document.body.style.display = 'flex';
                document.body.style.flexDirection = 'column';
                document.body.style.alignItems = 'center';
                document.body.style.justifyContent = 'center';
                document.body.style.height = '100vh';
                return;
            }
        } catch (error) {
            console.error('Error al verificar la VPN:', error);
            // En caso de error, no bloqueamos al usuario para evitar falsos negativos
        }

        // Si no se detecta VPN, ejecutar el resto del código de la página
        initializePageFeatures();
    }

    function initializePageFeatures() {
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
    }

    // Iniciar la verificación de VPN y la carga del contenido
    checkVPNAndLoadContent();
});
