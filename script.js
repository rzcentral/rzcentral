// Toggle tema
const toggleBtn = document.getElementById('toggleTheme');
const body = document.body;
toggleBtn.addEventListener('click', () => {
  if (body.getAttribute('data-theme') === 'light') {
    body.setAttribute('data-theme', 'dark');
  } else {
    body.setAttribute('data-theme', 'light');
  }
});

// Animaciones de cards al scroll
const cards = document.querySelectorAll('.card');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.2, rootMargin: '0px 0px -50px 0px'});
cards.forEach(card => observer.observe(card));

// Efectos de hero y navbar si la página tiene la clase 'hero'
const hero = document.querySelector('.hero');
if (hero) {
  const heroContent = document.querySelector('.hero-content');
  const navbar = document.getElementById('navbar');
  const heroTitle = document.querySelector('.hero-title');

  window.addEventListener('scroll', () => {
    let scrollY = window.scrollY;
    
    // Parallax
    hero.style.backgroundPositionY = `${scrollY * 0.5}px`;
    
    // Fade out y pop out del contenido
    heroContent.style.opacity = Math.max(1 - scrollY / 500, 0);
    heroContent.style.transform = `scale(${Math.max(1 - scrollY / 1000, 0.5)})`;
    
    // Animación de la navbar
    if (scrollY > 50) {
      navbar.style.background = 'var(--bg-color)';
      navbar.style.boxShadow = '0 4px 0px 0px var(--border-color)';
    } else {
      navbar.style.background = 'var(--card-bg)';
      navbar.style.boxShadow = '0 4px 0px 0px var(--border-color)';
    }
  });
}
