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

  /* ---- Dotted Surface (Three.js animated grid) ---- */
  /* Skipped on touch devices and prefers-reduced-motion to save battery/GPU */
  const dottedHost = document.getElementById('dottedSurface');
  if (dottedHost && !isMobile && !reduce && typeof THREE === 'undefined') {
    console.warn('[dotted-surface] Three.js no se cargó desde CDN — fondo desactivado.');
  }
  if (dottedHost && !isMobile && !reduce && typeof THREE !== 'undefined') {
    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x000000, 0);
    dottedHost.appendChild(renderer.domElement);

    const positions = [];
    const colors = [];
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
        );
        // Light gray dots on dark theme (RGB normalized)
        colors.push(0.78, 0.78, 0.82);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 8, vertexColors: true, transparent: true, opacity: 0.85, sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const arr = geometry.attributes.position.array;
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          arr[i * 3 + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.1;
    };
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    }, { passive: true });

    // Pause animation when tab is hidden — saves battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else rafId = requestAnimationFrame(animate);
    });
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
