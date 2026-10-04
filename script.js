// ── elementos que usamos ──────────────────────────────────
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menu-btn');
const menuLinks = document.querySelectorAll('.nav__link');
const heroPhoto = document.querySelector('.hero__photo');
const copyBtn = document.getElementById('copy-email');
const writeBtn = document.getElementById('write-btn');
const toast = document.getElementById('toast');

// si el usuario tiene las animaciones desactivadas no movemos nada
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// ── menu movil ────────────────────────────────────────────
// el icono de abrir/cerrar lo cambia el css con la clase .open
function toggleMenu(open) {
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
}

menuBtn.addEventListener('click', () => {
  toggleMenu(!nav.classList.contains('open'));
});

// al pulsar un enlace cerramos el menu
menuLinks.forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});


// ── scroll: fondo de la barra y parallax de la foto ───────
let scrollPending = false;

function onScroll() {
  // cuando bajamos un poco le ponemos fondo a la barra
  nav.classList.toggle('scrolled', window.scrollY > 40);

  // la foto del hero baja mas despacio que el resto de la pagina
  if (!reduceMotion && window.scrollY < window.innerHeight) {
    heroPhoto.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }

  scrollPending = false;
}

// el evento scroll salta muchas veces por segundo,
// asi que solo actualizamos una vez por frame con requestAnimationFrame
window.addEventListener('scroll', () => {
  if (scrollPending) return;
  scrollPending = true;
  requestAnimationFrame(onScroll);
}, { passive: true });

onScroll();


// ── enlace activo del menu ────────────────────────────────
// marcamos en azul la seccion que esta en mitad de la pantalla
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    menuLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
    });
  });
}, { rootMargin: '-50% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(section => {
  sectionObserver.observe(section);
});


// ── aparecer al hacer scroll ──────────────────────────────
// cuando un .reveal entra en pantalla le ponemos .visible y el css hace la animacion
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('visible');

    // solo lo animamos una vez
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(element => {
  revealObserver.observe(element);
});


// ── copiar el email ───────────────────────────────────────
const email = copyBtn.dataset.email;

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function copyEmail() {
  return navigator.clipboard.writeText(email)
    .then(() => showToast('Email copiado: ' + email));
}

copyBtn.addEventListener('click', () => {
  // si el navegador no deja copiar, abrimos el correo directamente
  copyEmail().catch(() => {
    window.location.href = 'mailto:' + email;
  });
});

// "escribeme" abre el correo (mailto), pero si el ordenador no tiene
// una app de correo configurada no pasa nada, asi que tambien copiamos el email.
// si el navegador no deja copiar (pasa en algunos navegadores de apps), al menos lo enseñamos
writeBtn.addEventListener('click', () => {
  copyEmail().catch(() => showToast('Mi email: ' + email));
});


// ── año del footer ────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();
