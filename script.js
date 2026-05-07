/* ============================================
   NAIM EL HADDADI — script.js
   Motion & interaction (GSAP + Vanilla Tilt)
   ============================================ */

/* Project card expand toggle — global so onclick="" can reach it */
function toggleProject(card, ev) {
  if (ev && ev.target && ev.target.closest('a, button[aria-label]')) return;
  card.classList.toggle('expanded');
}

window.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = matchMedia('(max-width: 768px)').matches;

  /* ---- Spline 3D scene: lazy-load only on desktop, on intersection ---- */
  const splineHost = document.getElementById('splineHost');
  const splineFallback = document.getElementById('splineFallback');
  if (splineHost) {
    if (isMobile) {
      // Mobile gets a graceful static message — Spline scenes are heavy
      if (splineFallback) {
        splineFallback.innerHTML =
          '<div class="text-center px-4"><div class="text-4xl mb-3">🎛</div>' +
          '<div class="text-xs font-mono text-slate-500">Escena 3D disponible<br>en escritorio</div></div>';
      }
    } else {
      // Defer scene creation until host is near viewport (saves initial JS / network)
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const v = document.createElement('spline-viewer');
          v.setAttribute('url', 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode');
          v.addEventListener('load', () => splineFallback && splineFallback.remove());
          splineHost.appendChild(v);
          obs.disconnect();
        });
      }, { rootMargin: '300px 0px' });
      io.observe(splineHost);
    }
  }

  /* ---- Scroll progress bar ---- */
  const sp = document.getElementById('scrollProgress');
  if (sp) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      sp.style.width = Math.min(100, (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100) + '%';
    }, { passive: true });
  }

  /* ---- Cursor-reactive ambient pool (skip on touch) ---- */
  if (!isMobile) {
    const pool = document.getElementById('cursorPool');
    if (pool) {
      let pendingX = 50, pendingY = 50, raf = null;
      window.addEventListener('mousemove', e => {
        pendingX = (e.clientX / window.innerWidth) * 100;
        pendingY = (e.clientY / window.innerHeight) * 100;
        if (!raf) raf = requestAnimationFrame(() => {
          pool.style.setProperty('--cx', pendingX + '%');
          pool.style.setProperty('--cy', pendingY + '%');
          raf = null;
        });
      }, { passive: true });
    }

    /* Buttons: localized cursor glow */
    document.querySelectorAll('.btn-glow').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        btn.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---- Word-split title reveal ---- */
  document.querySelectorAll('[data-words]').forEach(el => {
    const text = el.textContent.trim();
    el.innerHTML = text.split(' ').map(w => `<span class="word"><span>${w}</span></span>`).join(' ');
  });

  /* ---- Vanilla Tilt on cards (when library loaded, skip touch) ---- */
  if (typeof VanillaTilt !== 'undefined' && !isMobile) {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 4, speed: 600, glare: false, perspective: 1200, scale: 1.01,
    });
  }

  /* ---- GSAP setup with graceful fallback ---- */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('[data-fade], .word > span').forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  if (reduce) {
    gsap.set('[data-fade], .word > span', { opacity: 1, y: 0 });
    return;
  }

  /* ---- Hero entrance timeline ---- */
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-kicker', { y: 16, opacity: 0, duration: 0.7 }, 0)
    .from('.word > span',  { yPercent: 110, duration: 1, stagger: 0.05 }, 0.1)
    .from('.hero-sub',     { y: 24, opacity: 0, duration: 0.9 }, 0.5)
    .from('.hero-ctas',    { y: 24, opacity: 0, duration: 0.8 }, 0.7)
    .from('.hero-proof',   { y: 24, opacity: 0, duration: 0.8 }, 0.85)
    .from('.hero-core',    { scale: 0.85, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0.2);

  /* ---- Hero parallax (different layers, different speeds) ---- */
  gsap.to('.hero-title', { yPercent: -25, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } });
  gsap.to('.hero-core',  { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } });
  gsap.to('.bg-orb',     { yPercent: -30, ease: 'none', scrollTrigger: { start: 'top top', end: 'bottom top', scrub: 1 } });

  /* ---- Generic fade-up on every [data-fade] ---- */
  gsap.utils.toArray('[data-fade]').forEach(el => {
    gsap.from(el, {
      y: 50, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  /* ---- Architecture flow nodes: sequential 3D reveal ---- */
  const archNodes = document.querySelectorAll('.arch-node');
  if (archNodes.length) {
    gsap.from(archNodes, {
      y: 30, scale: 0.9, opacity: 0, rotateX: 8,
      duration: 0.7, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: '.arch-flow', start: 'top 80%' }
    });
  }

  /* ---- Float icons: subtle GSAP rotateY drift on top of CSS bob ---- */
  gsap.utils.toArray('.float-icon').forEach((el, i) => {
    gsap.to(el, {
      rotateY: i % 2 ? 6 : -6, duration: 4 + (i % 3),
      repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
  });

  /* ---- Roadmap nodes: stagger reveal ---- */
  const roadmapDots = document.querySelectorAll('.roadmap-node-dot');
  if (roadmapDots.length) {
    gsap.from(roadmapDots, {
      scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.2,
      scrollTrigger: { trigger: '.roadmap', start: 'top 75%' }
    });
  }

  /* ---- Cert badges: scale+rotate entrance ---- */
  gsap.utils.toArray('.cert-badge').forEach(badge => {
    gsap.from(badge, {
      scale: 0.6, rotate: -90, opacity: 0, duration: 1.2, ease: 'back.out(1.7)',
      scrollTrigger: { trigger: badge, start: 'top 85%' }
    });
  });
});
