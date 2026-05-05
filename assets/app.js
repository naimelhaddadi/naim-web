/* ============================================
   NAIM EL HADDADI — app.js
   ============================================ */

/* ---- URGENCY BAR ---- */
function closeBar() {
  const bar = document.getElementById('urgencyBar');
  if (!bar) return;
  bar.style.transition = 'height .3s ease, opacity .3s ease';
  bar.style.opacity = '0';
  bar.style.height = '0';
  bar.style.overflow = 'hidden';
  document.body.classList.add('no-bar');
  sessionStorage.setItem('barClosed', '1');
  setTimeout(() => bar.remove(), 350);
}
(function () {
  if (sessionStorage.getItem('barClosed') === '1') {
    const bar = document.getElementById('urgencyBar');
    if (bar) { bar.remove(); document.body.classList.add('no-bar'); }
  }
})();

/* ---- THEME ---- */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = document.body.style.getPropertyValue('--_theme') !== 'light';
  applyTheme(isDark ? 'light' : 'dark');
}
function applyTheme(theme) {
  const r = document.documentElement.style;
  const nav = document.getElementById('mainNav');
  if (theme === 'light') {
    r.setProperty('--black', '#ffffff');
    r.setProperty('--dark', '#f5f5f7');
    r.setProperty('--dark-2', '#ffffff');
    r.setProperty('--dark-3', '#e8e8ed');
    r.setProperty('--text', '#1d1d1f');
    r.setProperty('--text-2', 'rgba(29,29,31,.72)');
    r.setProperty('--text-3', 'rgba(29,29,31,.48)');
    r.setProperty('--text-4', 'rgba(29,29,31,.28)');
    r.setProperty('--dark-border', 'rgba(0,0,0,.08)');
    r.setProperty('--dark-border-2', 'rgba(0,0,0,.14)');
    r.setProperty('--blue', '#0066cc');
    r.setProperty('--blue-h', '#004499');
    document.body.style.setProperty('--_theme', 'light');
    nav && nav.classList.add('light-nav');
  } else {
    r.removeProperty('--black');
    r.removeProperty('--dark');
    r.removeProperty('--dark-2');
    r.removeProperty('--dark-3');
    r.removeProperty('--text');
    r.removeProperty('--text-2');
    r.removeProperty('--text-3');
    r.removeProperty('--text-4');
    r.removeProperty('--dark-border');
    r.removeProperty('--dark-border-2');
    r.removeProperty('--blue');
    r.removeProperty('--blue-h');
    document.body.style.setProperty('--_theme', 'dark');
    nav && nav.classList.remove('light-nav');
  }
  localStorage.setItem('theme', theme);
}
(function () {
  const saved = localStorage.getItem('theme');
  const preferLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  if (saved === 'light' || (!saved && preferLight)) applyTheme('light');
})();

/* ---- ROI CALCULATOR ---- */
function calcROI() {
  const el = id => document.getElementById(id);
  if (!el('sH')) return;
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
}

/* ---- LEAD MAGNET ---- */
(function () {
  const driveUrl = 'https://drive.google.com/file/d/1x3ls1mA8hJ6YtGUPo-vikhbo-V8nqNfR/view?usp=sharing';
  const form = document.getElementById('checklist-form');
  if (!form) return;
  form.onsubmit = async function (e) {
    e.preventDefault();
    const btn = document.getElementById('lead-btn');
    const email = document.getElementById('lead-email').value;
    btn.textContent = 'Preparando...';
    btn.disabled = true;
    try {
      await fetch('https://formspree.io/f/meeryawq', {
        method: 'POST',
        body: JSON.stringify({ email, category: 'Lead Magnet Download' }),
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      });
    } catch (_) {}
    const area = form.closest('.lm-inner');
    if (area) area.style.display = 'none';
    const success = document.getElementById('lm-success');
    if (success) success.style.display = 'block';
    const dl = document.getElementById('download-link');
    if (dl) dl.href = driveUrl;
    window.location.href = driveUrl;
  };
})();

/* ---- CHAT ---- */
let busy = false;
function rt(t) {
  return t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
}
function addMsg(role, text) {
  const c = document.getElementById('cMsgs');
  if (!c) return;
  const wrap = document.createElement('div');
  wrap.className = 'msg ' + role;
  const av = document.createElement('div');
  av.className = 'm-av ' + (role === 'u' ? 'usr' : 'bot');
  av.textContent = role === 'u' ? '👤' : '🤖';
  const bbl = document.createElement('div');
  bbl.className = 'bbl';
  bbl.innerHTML = rt(text);
  wrap.appendChild(av);
  wrap.appendChild(bbl);
  c.appendChild(wrap);
  c.scrollTop = c.scrollHeight;
  return bbl;
}
function showTyping() {
  const c = document.getElementById('cMsgs');
  const wrap = document.createElement('div');
  wrap.className = 'msg b';
  wrap.id = 'tyEl';
  wrap.innerHTML = '<div class="m-av bot">🤖</div><div class="ty-b"><span></span><span></span><span></span></div>';
  c.appendChild(wrap);
  c.scrollTop = c.scrollHeight;
}
function removeTyping() {
  const el = document.getElementById('tyEl');
  if (el) el.remove();
}
async function streamMsg(text) {
  const c = document.getElementById('cMsgs');
  const wrap = document.createElement('div');
  wrap.className = 'msg b';
  const av = document.createElement('div');
  av.className = 'm-av bot';
  av.textContent = '🤖';
  const bbl = document.createElement('div');
  bbl.className = 'bbl';
  wrap.appendChild(av);
  wrap.appendChild(bbl);
  c.appendChild(wrap);
  let acc = '';
  for (const word of text.split(' ')) {
    acc += (acc ? ' ' : '') + word;
    bbl.innerHTML = rt(acc);
    c.scrollTop = c.scrollHeight;
    await new Promise(r => setTimeout(r, 22));
  }
}
async function cSend() {
  const input = document.getElementById('cIn');
  const text = input ? input.value.trim() : '';
  if (!text || busy) return;
  busy = true;
  const opts = document.getElementById('cOpts');
  const btn = document.getElementById('cBtn');
  const st = document.getElementById('cSt');
  if (opts) opts.style.display = 'none';
  if (btn) btn.disabled = true;
  if (st) st.textContent = 'Escribiendo...';
  input.value = '';
  addMsg('u', text);
  showTyping();
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    removeTyping();
    await streamMsg(data.text || 'Sin respuesta del servidor.');
  } catch {
    removeTyping();
    await streamMsg('Error de conexión. ¿Está la función /api desplegada en Vercel?');
  }
  busy = false;
  if (btn) btn.disabled = false;
  if (st) st.textContent = 'En línea ahora';
}
function cs(text) {
  const input = document.getElementById('cIn');
  if (input) { input.value = text; cSend(); }
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {

  /* Scroll progress */
  const sp = document.getElementById('scrollProgress');
  if (sp) {
    const onScroll = () => {
      const h = document.documentElement;
      sp.style.width = Math.min(100, (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Cursor spotlight */
  const spot = document.getElementById('cursorSpot');
  if (spot && window.matchMedia('(hover:hover)').matches) {
    let tx = innerWidth / 2, ty = innerHeight / 2, cx = tx, cy = ty;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function tick() { cx += (tx - cx) * .18; cy += (ty - cy) * .18; spot.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(tick); })();
  }

  /* Scroll reveal */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
    });
  }, { threshold: .07, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.rv').forEach(el => ro.observe(el));

  /* Nav: light when over light sections */
  const nav = document.getElementById('mainNav');
  if (nav) {
    const lightSections = ['statement', 'roi', 'projects', 'skills', 'testimonials', 'faq', 'lead-magnet'];
    const navObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && lightSections.includes(e.target.id)) {
          nav.classList.add('light-nav');
        } else if (e.isIntersecting) {
          nav.classList.remove('light-nav');
        }
      });
    }, { rootMargin: '-50px 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach(s => navObs.observe(s));
  }

  /* Active nav link */
  const navLinks = document.querySelectorAll('.nav-links a');
  const navObs2 = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (!link) return;
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(s => navObs2.observe(s));

  /* Smooth scroll with nav offset */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = (nav ? nav.offsetHeight : 52) + 16;
      window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ROI calculator */
  calcROI();
  document.querySelectorAll('#roi input[type=range]').forEach(i => i.addEventListener('input', calcROI));

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => item.classList.toggle('open'));
  });

  /* Bento card mouse spotlight */
  document.querySelectorAll('.bc').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  /* 3D tilt on .tilt */
  if (window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.tilt').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* Magnetic buttons */
  if (window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.magnet').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * .16}px, ${(e.clientY - (r.top + r.height / 2)) * .22}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* Skills filter */
  const tabs = document.querySelectorAll('.sk-tab');
  const chips = document.querySelectorAll('#skillsPool .skill-chip');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      chips.forEach(c => c.classList.toggle('show', cat === 'all' || c.dataset.cat === cat));
    });
  });
});
