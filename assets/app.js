  (function() {
    const form = document.getElementById('checklist-form');
    // Enlace de descarga directa (ya configurado con tu ID)
    const driveUrl = "https://drive.google.com/file/d/1x3ls1mA8hJ6YtGUPo-vikhbo-V8nqNfR/view?usp=sharing";

    form.onsubmit = async function(e) {
      e.preventDefault();
      const btn = document.getElementById('lead-btn');
      const email = document.getElementById('lead-email').value;
      
      btn.innerText = "Preparando envío...";
      btn.disabled = true;

      try {
        // Registro en Formspree
        await fetch("https://formspree.io/f/meeryawq", {
          method: "POST",
          body: JSON.stringify({ email: email, category: "Lead Magnet Download" }),
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });

        // Transición a éxito
        document.getElementById('lm-form-area').style.display = 'none';
        document.getElementById('lm-success').style.display = 'block';
        document.getElementById('download-link').href = driveUrl;
        
        // Disparo de descarga
        window.location.href = driveUrl;

      } catch (err) {
        btn.innerText = "Error. Reintentar";
        btn.disabled = false;
        console.error(err);
      }
    };
  })();
/* 0b. URGENCY BAR */
function closeBar() {
  const bar = document.getElementById('urgencyBar');
  if (!bar) return;
  bar.style.transition = 'height .3s ease, opacity .3s ease';
  bar.style.opacity = '0';
  bar.style.height = '0';
  bar.style.overflow = 'hidden';
  document.body.classList.add('no-bar');
  setTimeout(() => bar.remove(), 350);
  sessionStorage.setItem('barClosed', '1');
}
// Check if bar was already closed
if (sessionStorage.getItem('barClosed') === '1') {
  const bar = document.getElementById('urgencyBar');
  if (bar) { bar.remove(); document.body.classList.add('no-bar'); }
}

/* 0. TEMA OSCURO/CLARO */
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}
// Init theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.setAttribute('data-theme', 'dark');
}

/* 1. SCROLL REVEAL */
document.querySelectorAll('.rv').forEach(el => el.classList.add('rv-hidden'));
const ro = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting){
    e.target.classList.remove('rv-hidden');
    e.target.classList.add('in');
    ro.unobserve(e.target);
  }
}), {threshold:.08, rootMargin:'0px 0px -20px 0px'});
document.querySelectorAll('.rv').forEach(el => ro.observe(el));

/* 2. CALCULADORA ROI (Forzada a iniciar) */
function calcROI(){
  try {
    const el = id => document.getElementById(id);
    if(!el('sH') || !el('sR') || !el('sT') || !el('sA')) return;
    
    const h = parseFloat(el('sH').value);
    const r = parseFloat(el('sR').value);
    const t = parseInt(el('sT').value);
    const a = parseFloat(el('sA').value) / 100;
    
    el('vH').textContent = h + 'h';
    el('vR').textContent = r + '€/h';
    el('vT').textContent = t;
    el('vA').textContent = Math.round(a * 100) + '%';
    
    const manual = h * r * t * 220;
    const savings = manual * a;
    const pilot = Math.min(Math.max(t * 600, 2500), 12000);
    const net = savings - pilot;
    
    el('bM').textContent = '€' + Math.round(manual).toLocaleString('es-ES');
    el('bI').textContent = '–€' + Math.round(pilot).toLocaleString('es-ES');
    el('bN').textContent = '€' + Math.round(Math.max(net, 0)).toLocaleString('es-ES');
    el('roiN').textContent = '€' + Math.round(Math.max(net, 0)).toLocaleString('es-ES');
  } catch (err) {
    console.error('Error calcROI', err);
  }
}

// Ejecución inmediata
calcROI();
document.querySelectorAll('#roi input[type=range]').forEach(i => i.addEventListener('input', calcROI));

/* 3. FORMULARIO DE CONTACTO */
function hf(e){
  e.preventDefault();
  const b = document.getElementById('fBtn');
  b.textContent = 'Enviando...'; 
  b.disabled = true;
  setTimeout(() => {
    document.getElementById('cForm').style.display = 'none';
    document.getElementById('fOk').style.display = 'block';
  }, 1100);
}

/* 4. CHAT SIMULADO DE IA */
/* 4. CHAT IA REAL CONECTADO */
let busy = false;

function rt(t){return t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')}

function addM(role,text){
  const c = document.getElementById('cMsgs');
  if(!c) return;
  const d = document.createElement('div'); d.className = 'msg ' + role;
  const av = document.createElement('div'); av.className = 'm-av ' + (role === 'u' ? 'usr' : 'bot'); av.innerHTML = role === 'u' ? '👤' : '<img src="letra-n.png" alt="" width="20px">';
  const b = document.createElement('div'); b.className = 'bbl'; b.innerHTML = rt(text);
  d.appendChild(av); d.appendChild(b); c.appendChild(d); c.scrollTop = c.scrollHeight;
  return b;
}

function showTy(){
  const c = document.getElementById('cMsgs');
  const d = document.createElement('div'); d.className = 'msg b'; d.id = 'tyEl';
  d.innerHTML = '<div class="m-av bot"><img src="letra-n.png" alt="" width="20px"></div><div class="ty-b"><span></span><span></span><span></span></div>';
  c.appendChild(d); c.scrollTop = c.scrollHeight;
}

function rmTy(){const e=document.getElementById('tyEl');if(e)e.remove();}

async function stream(text){
  const c = document.getElementById('cMsgs');
  const d = document.createElement('div'); d.className = 'msg b';
  const av = document.createElement('div'); av.className = 'm-av bot'; av.innerHTML = '<img src="letra-n.png" alt="" width="20px">';
  const b = document.createElement('div'); b.className = 'bbl'; b.innerHTML = '';
  d.appendChild(av); d.appendChild(b); c.appendChild(d); c.scrollTop = c.scrollHeight;
  let acc = '';
  for(const w of text.split(' ')){
    acc += (acc ? ' ' : '') + w;
    b.innerHTML = rt(acc);
    c.scrollTop = c.scrollHeight;
    await new Promise(r => setTimeout(r, 20));
  }
}

// ESTA FUNCIÓN ES EL BOTÓN DE ENVÍO
async function cSend() {
  const input = document.getElementById('cIn');
  const text = input.value;
  if (!text.trim() || busy) return;
  
  busy = true;
  document.getElementById('cOpts').style.display = 'none';
  document.getElementById('cBtn').disabled = true;
  document.getElementById('cSt').textContent = 'Escribiendo... ✨';
  input.value = '';
  
  addM('u', text);
  showTy();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    
    const data = await response.json();
    rmTy();
    if (data.text) {
      await stream(data.text);
    } else {
      await stream("He recibido una respuesta vacía. Revisa tu saldo en OpenAI.");
    }
  } catch (error) {
    rmTy();
    await stream("Error de conexión con el servidor. ¿Has subido la carpeta /api a Vercel?");
    console.error("Error:", error);
  }
  
  busy = false;
  document.getElementById('cBtn').disabled = false;
  document.getElementById('cSt').textContent = 'En línea ahora ✨';
}

// Función para los botones de sugerencia rápidos
function cs(text) {
  document.getElementById('cIn').value = text;
  cSend();
}

// Animación de estadísticas del hero
function animateStats() {
  const stats = document.querySelectorAll('.stat-n');
  stats.forEach((stat, index) => {
    const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
    if (target) {
      let current = 0;
      const increment = target / 60; // 60 frames para 1 segundo
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = stat.textContent.replace(/\d+/, target);
          clearInterval(timer);
        } else {
          stat.textContent = stat.textContent.replace(/\d+/, Math.floor(current));
        }
      }, 16);
    }
  });
}

// Animación de casos escalonada
function animateCases() {
  const cases = document.querySelectorAll('.cc');
  cases.forEach((caseEl, index) => {
    caseEl.style.animationDelay = `${index * 0.2}s`;
    caseEl.classList.add('case-animate');
  });
}

// Sistema de crecimiento dinámico
function dynamicGrowth() {
  const growthElements = document.querySelectorAll('.growth-dynamic');
  growthElements.forEach(el => {
    const baseValue = parseInt(el.dataset.base || el.textContent);
    const growth = Math.sin(Date.now() / 10000) * 0.1; // Oscilación suave
    const newValue = Math.round(baseValue * (1 + growth));
    el.textContent = el.textContent.replace(/\d+/, newValue);
  });
}

// Intersection Observer para animaciones al hacer scroll
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.1 });

  // Observar elementos que queremos animar
  document.querySelectorAll('.cc, .svc, .pi').forEach(el => {
    observer.observe(el);
  });
}

// Inicializar todo cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  // Animar estadísticas después de un pequeño delay
  setTimeout(animateStats, 500);
  
  // Animar casos
  animateCases();
  
  // Inicializar animaciones de scroll
  initScrollAnimations();
  
  // Sistema de crecimiento dinámico cada 5 segundos
  setInterval(dynamicGrowth, 5000);

  // Acordeón de dolor
  document.querySelectorAll('.pain-header').forEach(header => {
    header.addEventListener('click', function() {
      const item = this.closest('.pain-item');
      item.classList.toggle('open');
    });
  });

  // Acordeón de proceso
  document.querySelectorAll('.proc-header').forEach(header => {
    header.addEventListener('click', function() {
      const item = this.closest('.proc-item-acc');
      const isOpen = item.classList.contains('open');

      // Cerrar todos
      document.querySelectorAll('.proc-item-acc').forEach(el => el.classList.remove('open'));

      // Abrir solo si no estaba abierto
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  /* ========== WOW INTERACTIONS ========== */

  // Scroll progress bar
  const sp = document.getElementById('scrollProgress');
  if (sp) {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      sp.style.width = Math.min(100, Math.max(0, pct)) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Spotlight cursor (desktop)
  const spot = document.getElementById('cursorSpot');
  if (spot && window.matchMedia('(hover:hover)').matches) {
    let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    let cx = tx, cy = ty;
    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      spot.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    };
    tick();
  }

  // Bento spotlight: track per-card mouse position for ::before highlight
  document.querySelectorAll('.bento').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  // 3D tilt on .tilt cards
  if (window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.tilt').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  // Magnetic buttons
  if (window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.magnet').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  // Skills category filter
  const tabs = document.querySelectorAll('.sc-tab');
  const chips = document.querySelectorAll('#skillsPool .skill-chip');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      chips.forEach(c => {
        const match = cat === 'all' || c.dataset.cat === cat;
        c.classList.toggle('show', match);
      });
    });
  });

  // Smooth scroll for in-page anchors (already handled by scroll-behavior, but add offset for sticky nav)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    a.addEventListener('click', (e) => {
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      const offset = (document.querySelector('nav')?.offsetHeight || 60) + 12;
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  // Active nav link highlighting
  const navAnchors = document.querySelectorAll('.nav-links a');
  const navMap = {};
  navAnchors.forEach(a => { const id = a.getAttribute('href').slice(1); if (id) navMap[id] = a; });
  const sectIds = Object.keys(navMap);
  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      const a = navMap[en.target.id];
      if (a && en.isIntersecting) {
        navAnchors.forEach(x => x.style.color = '');
        a.style.color = 'var(--blue)';
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sectIds.forEach(id => { const s = document.getElementById(id); if (s) navObs.observe(s); });
});

// Override animateStats to keep suffixes (h+, h, k, etc.)
window.animateStats = function() {
  document.querySelectorAll('.stat-n').forEach(stat => {
    const original = stat.textContent;
    const m = original.match(/^([^\d]*)(\d+)(.*)$/);
    if (!m) return;
    const prefix = m[1], target = parseInt(m[2], 10), suffix = m[3];
    let current = 0;
    const dur = 1200, start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(target * eased);
      stat.textContent = prefix + v + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
};
