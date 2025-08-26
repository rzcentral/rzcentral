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

  // === API para detección VPN (IMPORTANTE: usar HTTPS si tu web es HTTPS) ===
  const VPN_DETECTION_API_URL = 'https://ip-api.com/json/?fields=hosting,as';

  async function checkVPNAndLoadContent() {
    try {
      // Timeout de 4s para no quedar colgado
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(VPN_DETECTION_API_URL, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      const asField = data && data.as ? String(data.as).toLowerCase() : '';
      if (data && (data.hosting === true || asField.includes('datacenter') || asField.includes('hosting'))) {
        // Insertar overlay de bloqueo en vez de borrar el body
        const overlay = document.createElement('div');
        overlay.id = 'vpn-overlay';
        Object.assign(overlay.style, {
          position: 'fixed',
          inset: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          background: '#fff',
          zIndex: '99999',
          padding: '1rem',
          textAlign: 'center'
        });
        overlay.innerHTML = `
          <div>
            <h1>Acceso denegado</h1>
            <p>Detectamos que estás usando una VPN o proxy. Desactívalo para continuar.</p>
          </div>`;
        document.body.appendChild(overlay);
        return;
      }
    } catch (error) {
      console.warn('Error al verificar VPN (continuando):', error);
      // En caso de error no bloqueamos al usuario
    }

    // Si no se detecta VPN → inicializar página
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

    // Eventos del modal (cerrar por botón o click fuera)
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

    // Botón “scroll-to-top” con requestAnimationFrame
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
