document.addEventListener('DOMContentLoaded', () => {

    // === Utilidad: detectar si estamos en la home ===
    const isHomePage = () => {
        const p = window.location.pathname || '/';
        return p === '/' || p === '' || p.endsWith('/index.html');
    };

    // === Elementos principales de la UI ===
    const elements = {
        navbarLinks: Array.from(document.querySelectorAll('.navbar-menu a[href^="#"]')),
        modal: document.getElementById('welcome-modal'),
        closeModalBtn: document.querySelector('.close-btn'),
        scrollToTopBtn: document.getElementById('scroll-to-top')
    };

    // === API para detección VPN (sin key, mejor soporte) ===
    const VPN_DETECTION_API_URL = 'https://ipwho.is/';

    async function checkVPNAndLoadContent() {
        try {
            // Timeout de 4s
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            const response = await fetch(VPN_DETECTION_API_URL, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            // Verificar si es VPN / Proxy / Hosting
            if (data.security && (data.security.vpn || data.security.proxy || data.security.hosting)) {
                const overlay = document.createElement('div');
                overlay.id = 'vpn-overlay';
                Object.assign(overlay.style, {
                    position: 'fixed',
                    inset: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    background: '#121212',
                    color: '#e0e0e0',
                    zIndex: '99999',
                    padding: '1rem',
                    textAlign: 'center',
                    fontFamily: 'Poppins, sans-serif'
                });
                overlay.innerHTML = `
                    <style>
                        #vpn-overlay h1 { font-size: 2.5em; color: #cf6679; }
                        #vpn-overlay p { font-size: 1.1em; }
                    </style>
                    <div>
                        <h1>Acceso denegado</h1>
                        <p>Detectamos que estás usando una VPN o proxy. Desactívalo para continuar.</p>
                    </div>`;
                document.body.appendChild(overlay);
                return;
            }
        } catch (error) {
            console.warn('Error al verificar VPN (continuando):', error);
        }

        // Si no hay VPN → inicializar la página
        initializePageFeatures();
    }

    // === Utilidad: smooth scroll robusto ===
    function smoothScrollToElement(el, offset = 80) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }

    // === Inicializar las funcionalidades de la página ===
    function initializePageFeatures() {
        // Smooth scroll en la home
        if (isHomePage() && elements.navbarLinks.length) {
            elements.navbarLinks.forEach(link => {
                link.addEventListener('click', e => {
                    const href = link.getAttribute('href') || '';
                    if (!href.startsWith('#') || href === '#') return;
                    e.preventDefault();
                    const id = href.slice(1);
                    const targetSection = id ? document.getElementById(id) : null;
                    if (targetSection) smoothScrollToElement(targetSection, 80);
                });
            });
        }

        // Modal de bienvenida (solo la primera visita en sesión)
        if (elements.modal && isHomePage() && !sessionStorage.getItem('visited')) {
            elements.modal.style.display = 'flex';
            sessionStorage.setItem('visited', 'true');
        }

        // Eventos del modal
        if (elements.modal) {
            if (elements.closeModalBtn) {
                elements.closeModalBtn.addEventListener('click', () => {
                    elements.modal.style.display = 'none';
                });
            }
            elements.modal.addEventListener('click', e => {
                if (e.target === elements.modal) {
                    elements.modal.style.display = 'none';
                }
            });
        }

        // Botón “scroll-to-top”
        if (elements.scrollToTopBtn) {
            let rafId = null;
            window.addEventListener('scroll', () => {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    elements.scrollToTopBtn.classList.toggle('is-visible', window.scrollY > 300);
                });
            });
            elements.scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Animaciones al hacer scroll (cards, títulos, etc.)
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.card, .team-card, .section-title')
            .forEach(el => observer.observe(el));
    }

    // === Arrancar proceso ===
    checkVPNAndLoadContent();
});
