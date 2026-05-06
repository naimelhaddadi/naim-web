/* NAIM EL HADDADI — app.js */

/* ---- THEME ---- */
function toggleTheme() {
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
    ['--black','--dark','--dark-2','--dark-3','--text','--text-2','--text-3','--text-4','--dark-border','--dark-border-2','--blue','--blue-h'].forEach(p => r.removeProperty(p));
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
    await streamMsg('Error de conexión.');
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
  const M = window.Motion;
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Motion One: entrance + scroll reveals */
  if (M && !reduce) {
    const { animate, inView } = M;
    const SPRING = { duration: 0.9, easing: [0.22, 1, 0.36, 1] };

    document.querySelectorAll('[data-anim]').forEach(el => {
      const kind = el.dataset.anim;
      const delay = parseFloat(el.dataset.delay || '0');
      const inHero = el.closest('#hero');
      const from = kind === 'fade-in'
        ? { opacity: 0 }
        : { opacity: 0, transform: 'translateY(28px)' };
      const to = kind === 'fade-in'
        ? { opacity: 1 }
        : { opacity: 1, transform: 'translateY(0)' };
      Object.assign(el.style, from);
      if (inHero) {
        animate(el, to, { ...SPRING, delay });
      } else {
        inView(el, () => { animate(el, to, { ...SPRING, delay }); }, { margin: '0px 0px -10% 0px' });
      }
    });

    /* Stagger bento cards on entry */
    const bento = document.querySelector('.bento');
    if (bento) {
      const cards = bento.querySelectorAll('.bc');
      cards.forEach(c => Object.assign(c.style, { opacity: 0, transform: 'translateY(24px) scale(.98)' }));
      inView(bento, () => {
        cards.forEach((c, i) => {
          animate(c, { opacity: 1, transform: 'translateY(0) scale(1)' }, { ...SPRING, delay: i * 0.08 });
        });
      }, { margin: '0px 0px -15% 0px' });
    }
  } else {
    document.querySelectorAll('[data-anim]').forEach(el => { el.style.opacity = 1; });
  }

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

  /* Nav: light theme + active link */
  const nav = document.getElementById('mainNav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const lightSections = new Set(['roi', 'projects', 'faq']);
  if (nav) {
    const themeObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        nav.classList.toggle('light-nav', lightSections.has(e.target.id));
      });
    }, { rootMargin: '-50px 0px -50% 0px' });
    sections.forEach(s => themeObs.observe(s));
  }
  const linkObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (!link || !e.isIntersecting) return;
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => linkObs.observe(s));

  /* Pause hero blob animation when scrolled away */
  const heroBlobs = document.querySelectorAll('.hero-bg b');
  const hero = document.getElementById('hero');
  if (hero && heroBlobs.length) {
    new IntersectionObserver(([e]) => {
      heroBlobs.forEach(b => { b.style.animationPlayState = e.isIntersecting ? 'running' : 'paused'; });
    }).observe(hero);
  }

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

  /* 3D tilt + magnetic buttons */
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
    document.querySelectorAll('.magnet').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * .16}px, ${(e.clientY - (r.top + r.height / 2)) * .22}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }
});
