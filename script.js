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
});