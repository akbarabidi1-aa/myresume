/* ═══════════════════════════════════════════════════════════════
   ELITE PORTFOLIO SCRIPT
   Three.js 3D Hero · GSAP ScrollTrigger · Magnetic Cursor ·
   Typewriter · Counter Animations · Bento Panel · Aurora Beams
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  /* ── CONSTANTS ──────────────────────────────────────────── */
  const CORAL  = 0xFF8A5B;
  const CREAM  = 0xFFD2A6;
  const IVORY  = 0xFFF3E9;
  const TAGLINES = [
    'ASP.NET Core Specialist',
    'Full Stack Engineer',
    'AI & ML Enthusiast',
    'Cloud Architect',
    'Backend Systems Expert'
  ];

  /* ═══════════════════════════════════════════════════════════
     1. AURORA BEAMS (background)
  ═══════════════════════════════════════════════════════════ */
  const streamContainer = document.getElementById('light-stream-container');
  if (streamContainer) {
    for (let i = 0; i < 60; i++) {
      const b = document.createElement('div');
      b.className = 'light-beam';
      const rise = (Math.random() * 2 + 4).toFixed(2);
      const drop = (Math.random() * 3 + 3).toFixed(2);
      b.style.cssText = `
        left:${Math.random()*100}%;
        width:${Math.floor(Math.random()*3)+1}px;
        animation-delay:${(Math.random()*6).toFixed(2)}s;
        animation-duration:${rise}s,${rise}s,${drop}s;
      `;
      streamContainer.appendChild(b);
    }
  }

  /* ═══════════════════════════════════════════════════════════
     2. LOADER
  ═══════════════════════════════════════════════════════════ */
  let pct = 0;
  const loaderBar = document.getElementById('loader-bar');
  const loaderPct = document.getElementById('loader-pct');

  const lInterval = setInterval(() => {
    pct += Math.floor(Math.random() * 8) + 3;
    if (pct >= 100) {
      pct = 100; clearInterval(lInterval);
      if (loaderBar) loaderBar.style.width = '100%';
      if (loaderPct) loaderPct.textContent = '100';
      setTimeout(() => {
        gsap.to('#loader', {
          opacity: 0, duration: 0.8, ease: 'power4.inOut',
          onComplete: () => {
            const l = document.getElementById('loader');
            if (l) l.style.display = 'none';
            initHero();
          }
        });
      }, 300);
      return;
    }
    if (loaderBar) loaderBar.style.width = pct + '%';
    if (loaderPct) loaderPct.textContent = String(pct).padStart(3,'0');
  }, 40);

  /* ═══════════════════════════════════════════════════════════
     3. CUSTOM CURSOR — magnetic + trail
  ═══════════════════════════════════════════════════════════ */
  const curDot    = document.getElementById('cur-dot');
  const curCircle = document.getElementById('cur-circle');
  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let cx = mx, cy = my;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  if (curDot) curDot.style.display = 'block';
  if (curCircle) curCircle.style.display = 'block';

  (function tickCursor() {
    if (curDot) {
      curDot.style.left = mx + 'px';
      curDot.style.top  = my + 'px';
    }
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    if (curCircle) {
      curCircle.style.left = cx + 'px';
      curCircle.style.top  = cy + 'px';
    }
    requestAnimationFrame(tickCursor);
  })();

  document.addEventListener('mousedown', () => curCircle?.classList.add('clicking'));
  document.addEventListener('mouseup',   () => curCircle?.classList.remove('clicking'));

  document.querySelectorAll('a, button, .proj-row, .glass').forEach(el => {
    el.addEventListener('mouseenter', () => curCircle?.classList.add('hovering'));
    el.addEventListener('mouseleave', () => curCircle?.classList.remove('hovering'));
  });

  /* ═══════════════════════════════════════════════════════════
     4. SCROLL PROGRESS
  ═══════════════════════════════════════════════════════════ */
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.body.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = (scrolled / total * 100) + '%';
    document.getElementById('nav')?.classList.toggle('scrolled', scrolled > 50);
  });

  /* ═══════════════════════════════════════════════════════════
     5. MOBILE MENU
  ═══════════════════════════════════════════════════════════ */
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  });
  document.querySelectorAll('.mm-link').forEach(l => {
    l.addEventListener('click', () => {
      mobileMenu?.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     6. THREE.JS 3D HERO — Cybernetic Matrix Node
  ═══════════════════════════════════════════════════════════ */
  function initThreeHero() {
    const canvas = document.getElementById('hero-three');
    if (!canvas || typeof THREE === 'undefined') return;

    const wrap   = document.getElementById('hero-canvas-wrap');
    const W      = wrap.clientWidth;
    const H      = wrap.clientHeight;

    /* Scene + camera */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 5;

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    /* ── Group that holds everything ── */
    const group = new THREE.Group();
    scene.add(group);

    /* ── CORE ICOSAHEDRON (wireframe shell) ── */
    const icoGeo  = new THREE.IcosahedronGeometry(1.15, 1);
    const icoMat  = new THREE.MeshBasicMaterial({
      color: CORAL, wireframe: true, transparent: true, opacity: 0.18
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    group.add(ico);

    /* ── INNER SOLID SPHERE (glow core) ── */
    const coreGeo = new THREE.SphereGeometry(0.62, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a22,
      metalness: 0.9,
      roughness: 0.15,
      emissive: new THREE.Color(CORAL),
      emissiveIntensity: 0.22,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    /* ── RING 1 ── */
    const r1Geo = new THREE.TorusGeometry(1.55, 0.008, 8, 120);
    const r1Mat = new THREE.MeshBasicMaterial({ color: CORAL, transparent: true, opacity: 0.55 });
    const ring1 = new THREE.Mesh(r1Geo, r1Mat);
    ring1.rotation.x = Math.PI * 0.35;
    group.add(ring1);

    /* ── RING 2 ── */
    const r2Geo = new THREE.TorusGeometry(1.85, 0.005, 8, 120);
    const r2Mat = new THREE.MeshBasicMaterial({ color: CREAM, transparent: true, opacity: 0.3 });
    const ring2 = new THREE.Mesh(r2Geo, r2Mat);
    ring2.rotation.x = Math.PI * 0.6;
    ring2.rotation.y = Math.PI * 0.2;
    group.add(ring2);

    /* ── RING 3 (outer dashed-style) ── */
    const r3Geo = new THREE.TorusGeometry(2.2, 0.003, 4, 60);
    const r3Mat = new THREE.MeshBasicMaterial({ color: IVORY, transparent: true, opacity: 0.12 });
    const ring3 = new THREE.Mesh(r3Geo, r3Mat);
    ring3.rotation.z = Math.PI * 0.15;
    group.add(ring3);

    /* ── FLOATING NODES (small glowing spheres in orbit) ── */
    const nodeMat = new THREE.MeshBasicMaterial({ color: CORAL });
    const nodePositions = [
      [2.0, 0.3, 0.1], [-1.9, 0.6, -0.3],
      [0.3, 2.1, 0.4], [0.5, -1.85, 0.6],
      [-0.4, 0.5, 2.0], [1.4, -1.3, 0.7],
    ];
    const nodes = nodePositions.map(([x, y, z]) => {
      const ng  = new THREE.SphereGeometry(0.055, 8, 8);
      const nm  = new THREE.Mesh(ng, nodeMat);
      nm.position.set(x, y, z);
      group.add(nm);
      return nm;
    });

    /* ── NODE CONNECTORS (lines to core) ── */
    nodes.forEach(n => {
      const pts = [new THREE.Vector3(0,0,0), n.position.clone()];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({
        color: CORAL, transparent: true, opacity: 0.1
      });
      group.add(new THREE.Line(lineGeo, lineMat));
    });

    /* ── PARTICLE FIELD ── */
    const pCount  = 280;
    const pGeo    = new THREE.BufferGeometry();
    const pPos    = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random()-0.5) * 8;
      pPos[i*3+1] = (Math.random()-0.5) * 8;
      pPos[i*3+2] = (Math.random()-0.5) * 8;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat  = new THREE.PointsMaterial({ color: CREAM, size: 0.028, transparent: true, opacity: 0.45 });
    const particles = new THREE.Points(pGeo, pMat);
    group.add(particles);

    /* ── LIGHTING ── */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const pLight1 = new THREE.PointLight(CORAL, 2.5, 8);
    pLight1.position.set(3, 2, 3);
    scene.add(pLight1);
    const pLight2 = new THREE.PointLight(CREAM, 1.2, 8);
    pLight2.position.set(-3, -1, 2);
    scene.add(pLight2);

    /* ── MOUSE LERP VARS ── */
    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;
    let normMx = 0, normMy = 0;

    window.addEventListener('mousemove', e => {
      normMx = (e.clientX / window.innerWidth  - 0.5) * 2;
      normMy = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ── RESIZE ── */
    window.addEventListener('resize', () => {
      const nW = wrap.clientWidth, nH = wrap.clientHeight;
      camera.aspect = nW / nH;
      camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    });

    /* ── RENDER LOOP ── */
    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.008;

      /* Smooth mouse tracking — lerp */
      targetRotX = normMy * 0.55;
      targetRotY = normMx * 0.55;
      currentRotX += (targetRotX - currentRotX) * 0.055;
      currentRotY += (targetRotY - currentRotY) * 0.055;

      /* Apply to group */
      group.rotation.x = currentRotX;
      group.rotation.y = currentRotY;

      /* Self-rotate elements */
      ico.rotation.y    += 0.004;
      ico.rotation.z    += 0.002;
      ring1.rotation.z  += 0.006;
      ring2.rotation.x  += 0.005;
      ring2.rotation.y  += 0.003;
      ring3.rotation.z  -= 0.002;
      ring3.rotation.x  += 0.003;
      particles.rotation.y += 0.0012;

      /* Nodes pulse (scale bob) */
      nodes.forEach((n, i) => {
        const sc = 1 + Math.sin(t * 1.6 + i * 1.1) * 0.25;
        n.scale.setScalar(sc);
      });

      /* Core emissive breathe */
      coreMat.emissiveIntensity = 0.18 + Math.sin(t * 1.4) * 0.1;

      /* Point light orbit */
      pLight1.position.x = Math.sin(t * 0.7) * 3.5;
      pLight1.position.y = Math.cos(t * 0.5) * 2.5;
      pLight2.position.x = Math.cos(t * 0.6) * 3;
      pLight2.position.z = Math.sin(t * 0.8) * 2;

      renderer.render(scene, camera);
    }
    animate();
  }

  /* ═══════════════════════════════════════════════════════════
     7. TYPEWRITER
  ═══════════════════════════════════════════════════════════ */
  let tIdx = 0, charIdx = 0, deleting = false;
  const tEl = document.getElementById('ttext');
  function typewriter() {
    if (!tEl) return;
    const str = TAGLINES[tIdx];
    tEl.textContent = deleting
      ? str.substring(0, --charIdx)
      : str.substring(0, ++charIdx);
    let delay = deleting ? 28 : 72;
    if (!deleting && charIdx === str.length)     { delay = 2400; deleting = true; }
    else if (deleting && charIdx === 0)          { deleting = false; tIdx = (tIdx+1) % TAGLINES.length; delay = 380; }
    setTimeout(typewriter, delay);
  }

  /* ═══════════════════════════════════════════════════════════
     8. HERO SEQUENCE (fires after loader)
  ═══════════════════════════════════════════════════════════ */
  function initHero() {
    initThreeHero();
    typewriter();

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('#hero-badge',       { opacity: 1, y: 0, duration: 0.7 })
      .to('.line-inner',       { y: '0%', duration: 1.1, stagger: 0.12, ease: 'power4.out' }, '-=0.3')
      .to('#hero-title',       { opacity: 1, duration: 0.01 }, '<')
      .to('#hero-role',        { opacity: 1, duration: 0.5 }, '-=0.4')
      .to('#hero-desc',        { opacity: 1, duration: 0.8 }, '-=0.3')
      .to('#hero-btns',        { opacity: 1, duration: 0.7 }, '-=0.4')
      .to('#hero-stats',       { opacity: 1, duration: 0.7 }, '-=0.3')
      .to('#hero-canvas-wrap', { opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.8');

    /* Counter animation */
    setTimeout(() => {
      document.querySelectorAll('.val[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target);
        const prefix = el.querySelector('.val-prefix')?.outerHTML || '';
        let cur = 0;
        const step = target / 40;
        const iv = setInterval(() => {
          cur = Math.min(cur + step, target);
          el.innerHTML = prefix + Math.ceil(cur);
          if (cur >= target) clearInterval(iv);
        }, 35);
      });
    }, 1400);
  }

  /* ═══════════════════════════════════════════════════════════
     9. GSAP SCROLL REVEALS
  ═══════════════════════════════════════════════════════════ */
  gsap.utils.toArray('.reveal-up').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 55 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: {
          trigger: el, start: 'top 88%',
          delay: (i % 4) * 0.08
        }
      }
    );
  });

  /* Section headings get a special stagger */
  gsap.utils.toArray('.s-eyebrow,.s-title,.s-sub').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      }
    );
  });

  /* ═══════════════════════════════════════════════════════════
     10. GLASS CARD 3D TILT on mousemove
  ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.glass').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r    = card.getBoundingClientRect();
      const xPct = (e.clientX - r.left) / r.width  - 0.5;
      const yPct = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${xPct*8}deg) rotateX(${-yPct*8}deg) translateY(-8px)`;
      /* bento spotlight */
      card.style.setProperty('--bx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--by', (e.clientY - r.top)  + 'px');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ═══════════════════════════════════════════════════════════
     11. BENTO PANEL
  ═══════════════════════════════════════════════════════════ */
  const bentoPanel  = document.getElementById('bento-panel');
  const bTitle      = document.getElementById('b-panel-title');
  const bTech       = document.getElementById('b-panel-tech');
  const bOverview   = document.getElementById('b-panel-overview');
  const bLinkLive   = document.getElementById('b-link-live');
  const bLinkGit    = document.getElementById('b-link-git');

  document.querySelectorAll('.proj-row').forEach(row => {
    row.addEventListener('click', () => {
      const title = row.querySelector('.proj-row-title')?.textContent || 'Blueprint';
      const desc  = row.querySelector('.proj-row-desc')?.textContent  || '';

      if (bTitle)   bTitle.innerHTML   = `${title} <em>Matrix</em>`;
      if (bOverview) bOverview.textContent = desc;

      if (bTech) {
        bTech.innerHTML = '';
        row.querySelectorAll('.proj-tags .t').forEach(t => {
          const s = document.createElement('span');
          s.className   = 'bento-tch';
          s.textContent = t.textContent;
          bTech.appendChild(s);
        });
      }

      const rowLive = row.querySelector('.proj-links a[href*="http"]');
      const rowGit  = row.querySelector('.proj-links a');
      if (bLinkLive) { bLinkLive.href = rowLive?.href || '#'; bLinkLive.style.display = rowLive ? 'inline-flex' : 'none'; }
      if (bLinkGit)  { bLinkGit.href  = rowGit?.href  || '#'; bLinkGit.style.display  = rowGit  ? 'inline-flex' : 'none'; }

      if (bentoPanel) {
        bentoPanel.style.display = 'flex';
        gsap.fromTo(bentoPanel,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }
        );
        setTimeout(() => bentoPanel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
    });
  });

  document.getElementById('bento-close-btn')?.addEventListener('click', () => {
    gsap.to(bentoPanel, {
      opacity: 0, y: 40, duration: 0.4, ease: 'power2.in',
      onComplete: () => { if (bentoPanel) bentoPanel.style.display = 'none'; }
    });
  });

  /* Bento card spotlight */
  document.querySelectorAll('.b-card').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--bx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--by', (e.clientY - r.top)  + 'px');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     12. CONTACT FORM
  ═══════════════════════════════════════════════════════════ */
  document.getElementById('c-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn   = document.getElementById('form-submit');
    const toast = document.getElementById('form-toast');
    if (btn) btn.disabled = true;
    if (toast) {
      toast.style.display = 'block';
      toast.style.background = 'rgba(255,210,166,.08)';
      toast.style.color = 'var(--coral)';
      toast.textContent = 'Encrypting payload…';
    }
    setTimeout(() => {
      if (toast) {
        toast.style.background = 'rgba(255,138,91,.08)';
        toast.style.color = '#fff';
        toast.textContent = 'Message delivered. I\'ll be in touch soon!';
      }
      this.reset();
      if (btn) btn.disabled = false;
      setTimeout(() => {
        if (toast) gsap.to(toast, { opacity:0, duration:.4, onComplete: () => { toast.style.display='none'; toast.style.opacity='1'; }});
      }, 5000);
    }, 1800);
  });

  /* ═══════════════════════════════════════════════════════════
     13. PARALLAX on hero badge + orbit ring
  ═══════════════════════════════════════════════════════════ */
  window.addEventListener('mousemove', e => {
    const nx = (e.clientX / window.innerWidth  - 0.5);
    const ny = (e.clientY / window.innerHeight - 0.5);
    gsap.to('.canvas-ring',   { x: nx * 14, y: ny * 14, duration: 1.2, ease:'power1.out' });
    gsap.to('.canvas-ring-2', { x: nx * -8, y: ny * -8, duration: 1.5, ease:'power1.out' });
    gsap.to('.amb-1',         { x: nx * 30, y: ny * 30, duration: 2,   ease:'power1.out' });
    gsap.to('.amb-2',         { x: nx * -20,y: ny *-20, duration: 2.5, ease:'power1.out' });
  });

  /* ═══════════════════════════════════════════════════════════
     14. SECTION PARALLAX on scroll
  ═══════════════════════════════════════════════════════════ */
  gsap.utils.toArray('.section').forEach(sec => {
    gsap.fromTo(sec.querySelector('.s-inner'),
      { y: 0 },
      {
        y: -20,
        ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true }
      }
    );
  });

}); /* end DOMContentLoaded */